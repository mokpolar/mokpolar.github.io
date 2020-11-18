---
layout: post
title: MobileNet을 KFServing custom image로 Kubernetes에 배포하기 A to Z (feat. TransFormer를 이용한 전처리)
summary: custom image를 사용하면 컨테이너안에 사용자 자신의 래핑된 모델을 KFServing을 통해 서빙할 수 있다.....
featured-img: objects_1920
categories: [Devlog]
author: mokpolar
sitemap:
    changefreq: daily
    priority: 1.0
---

# MobileNet을 KFServing custom image로 Kubernetes에 배포하기 A to Z (feat. TransFormer를 이용한 전처리)

### KFServing InferenceService의 Custom Image를 쓰는 이유와 다른 점
  
---
이번에는 KFServing InferenceService Custom Image 사용자 이미지를 이용해서 Kubernetes에서의 서빙을 해본다.

전 글에서 포스팅 한 내용은 사용자가 KFServing InferenceService 매니페스트에 Tensorflow pb파일의 경로를 지정해주면 KFServing에서 알아서 Tensorflow Serving을 사용해서 배포를 해주는 구조였다.  

하지만 Custom Image를 사용하면 유저들이 자기 자신의 wrapped model을 컨테이너를 이용해 만들고 KFServing을 통해 서빙할 수 있다.  
예를 들어 지금 하고 있는 작업에서는 모델을 3개를 통과해서 결과물이 나오는 데 이 작업을 위해서 Custom Image를 사용하였다. 

Custom Image는 별도의 웹 서버를 필요로 한다.  
예를 들어 모델의 엔드포인트를 위해 Flask를 띄운다던가, 그러나    
만약 tornado 웹 서버를 쓰는 kfserving.KFModel을 사용하면 별도로 웹 서버를 구현하지 않아도 된다.

이 포스팅에서는 Tensorflow를 이용해 MobileNet으로 pb파일을 만들고 이를 custom image로 배포해서 모델 서빙을 해보겠다. 


### KFServing InferenceService Transformer를 이용한 전/후처리에 대해서
---
![](./../assets/img/posts/2020-10-11-01-01-02.jpg)  
출처: [KFServing Github](https://github.com/kubeflow/kfserving)

KFServing InferenceService 데이터 플레인 아키텍쳐를 보면,  
Transformer를 거쳐서 predict를 할 수 있게 되어있다.  
Transformer에서는 사용자가 모델에 넣을 형태로 데이터들을 가공하는 전처리 혹은 그 결과물을 사용자가 보고 싶은대로 가공하는 후처리 작업을 할 수 있다.  

예를 들어, base64 형태의 이미지 파일을 그대로 Transformer에 보내서 모델에 필요한 input으로 전처리를 한 뒤  
Predictor로 보내고 결과를 받아서 다시 보기 쉽게 후처리를 하게 되는 것이다. 

### 서빙을 위해 해야할 일들

Kubernetes 클러스터에 KFServing이 설치되어 있다는 전제 하에,

1. 모델 pb파일을 스토리지에 올리기 (여기서는 Persistent Volume Claim) 
2. Pod 에서 실행되는 Python 파일 준비
3. Python 파일이 동작하는 환경을 보장하는 Dockerfile을 가지고 Docker Hub에 푸쉬 
4. InferenceService 매니페스트 yaml 파일 준비 후 배포
5. 실행해보기

하나 하나씩 해보자. 

## 1. 모델 pb파일을 스토리지에 올리기 

### MobileNet으로 pb 파일 만들기 

```python
import tensorflow as tf
from tensorflow.keras.applications.mobilenet import MobileNet, decode_predictions

mobilenet = tf.keras.applications.mobilenet
model = mobilenet.MobileNet(weights = "imagenet")

model.save('my_model')
```

이제 my_model 폴더에 모델이 저장되었을 것이다. 

### AWS EBS 로 Persistent Volume 만들기 

현재 AWS EKS를 쓰고 있기 때문에 스토리지로 다루기 편한 EBS를 사용하기로 했다. 

* EBS 생성
```bash
VOLUME_ID=$(aws ec2 create-volume --size 55 --region <REGION> --availability-zone <Availability Zone> --volume-type gp2 | jq '.VolumeId' -)

echo $VOLUME_ID
```

* Persistent Volume으로서 바인딩하는 매니페스트

```yaml

# pv.yaml

apiVersion: v1
kind: PersistentVolume
metadata:
  name: model-pv
spec:
  capacity:
    storage: 50Gi
  accessModes:
    - ReadWriteMany
  awsElasticBlockStore:
      fsType: ext4
      volumeID: <VOLUME_ID> # 아까 만들어 둔 EBS의 VOLUME_ID
---

apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: model-pvc
  namespace: kfserving-test
spec:
  storageClassName: ""
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 50Gi
```

* PV/PVC 생성

```bash
kubectl create -f pv.yaml -n <NAMESPACE>
```


### 더 좋은 방법이 있겠으나.. 일단 dummy pod 생성해서 PVC 부착하고 만든 모델 업로드

* 아까 생성한 PVC를 부착한 dummy pod 매니페스트

```yaml

# pod.yaml

apiVersion: v1
kind: Pod
metadata:
  name: dummy-pod
spec:
  containers:
  - image: busybox
    name: test-container
    command: ['sh', '-c', 'echo "Hello, Kubernetes!" && sleep 3600']
    volumeMounts:
    - mountPath: <MOUNT_PATH> # ex) /tmp
      name: model-pvc
  volumes:
  - name: model-pvc
    persistentVolumeClaim:
      claimName: model-pvc

```


* dummy pod 배포

```bash
kubectl create -f pod.yaml
```

* 부착된 PVC에 모델 파일 업로드

```bash
kubectl cp my_model default/dummy-pod:<MOUNT_PATH>
```
이렇게 하면 이제 볼륨에 모델이 들어갔다. 

## 2. Pod 에서 실행되는 Python 파일 준비


* Python 파일 준비 
```python
import argparse
import base64
import io
import logging
from typing import Dict

import json
import kfserving
import numpy as np

from PIL import Image

import time

from tensorflow.keras.applications.mobilenet import decode_predictions
import tensorflow as tf


logging.basicConfig(level=kfserving.constants.KFSERVING_LOGLEVEL)


def image_transform(instance):
    img = base64.b64decode(instance['image']['b64'])
    img = Image.open(io.BytesIO(img))
    img = img.resize((224, 224))
    img = np.array(img)
    img = img/255
    img = img.reshape(-1, 224, 224, 3)
    return img.tolist()

def parsing_prediction(prediction):
    label = decode_predictions(np.asarray([prediction]))
    label = label[0][0]
    output = [label[1], str(round(label[2]*100, 2))+'%']
    return output


class ImageTransformer(kfserving.KFModel):
    def __init__(self, name: str, predictor_host: str):
        super().__init__(name)
        self.predictor_host = predictor_host

    def preprocess(self, inputs: Dict) -> Dict:
        return {'instances': image_transform(inputs['instances'][0])}

    def postprocess(self, inputs: Dict) -> Dict:
        start_post = time.time()
        return {'predictions': [parsing_prediction(prediction) for prediction in inputs['predictions']]}


if __name__ == "__main__":
    DEFAULT_MODEL_NAME = "mobilenet"

    parser = argparse.ArgumentParser(parents=[kfserving.kfserver.parser])
    parser.add_argument('--model_name', default=DEFAULT_MODEL_NAME,
                        help='The name that the model is served under.')
    parser.add_argument('--predictor_host', help='The URL for the model predict function', required=True)

    args, _ = parser.parse_known_args()

    transformer = ImageTransformer(args.model_name, predictor_host=args.predictor_host)
    kfserver = kfserving.KFServer()
    kfserver.start(models=[transformer])
```



## 3. Python 파일이 동작하는 환경을 보장하는 Dockerfile을 가지고 Docker Hub에 푸시

* Dockerfile
```docker
FROM tensorflow/tensorflow:2.1.0-py3


RUN pip install kfserving==0.3.0 numpy image


ENV APP_HOME /app
WORKDIR $APP_HOME
ADD simple_mobilenet_transformer.py /app/

ENTRYPOINT ["python", "image_transformer.py"]
```


```sh
docker build -t <YOUR_ID>/<IMAGE_NAME>:<TAG> .

docker push <YOUR_ID>/<IMAGE_NAME>:<TAG>
```

## 4. InferenceService 매니페스트 yaml 파일 준비 후 배포

* InferenceService 매니페스트
```yaml

# mobilenet_deploy.yaml

apiVersion: "serving.kubeflow.org/v1alpha2"
kind: "InferenceService"
metadata:
  name: "simple-mobilenet-transformer"
spec:
  default:
    predictor:
      minReplicas: 1
      tensorflow:
        storageUri: "pvc://my-pvc/my_model/"
    transformer:
      minReplicas: 1
      custom:
        container:
          image: <YOUR_ID>/<IMAGE_NAME>:<TAG>

```


* InferneceService 배포
```sh
kubectl create -f mobilenet_deploy.yaml
```


## 5. 실행 해보기 



### Reference

* https://github.com/kubeflow/kfserving/tree/master/docs/samples/custom/kfserving-custom-model
* https://github.com/kubeflow/kfserving/tree/master/docs/samples/transformer/image_transformer
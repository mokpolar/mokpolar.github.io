---
layout: post
title: EKS에 Kubeflow를 설치한 후기
summary: 딥러닝 모델 서빙용으로 KFServing을 사용할 수 있을 지를 테스트하게 되었다. Kubeflow 라는 이름부터 생소한 상황이라 이런 저런 삽질을 많이 했고 그 과정을 기억하기 위해 이 글을 쓴다....
featured-img: office1
categories: [Devlog]
sitemap:
  changefreq: daily
  priority: 1.0
---

# EKS에 Kubeflow를 설치한 후기

딥러닝 모델 서빙용으로 KFServing을 사용할 수 있을 지를 테스트하게 되었다.  
Kubeflow 라는 이름부터 생소한 상황이라 이런 저런 삽질을 많이 했고 그 과정을 기억하기 위해 이 글을 쓴다.
  


### EKS를 사용하는 이유?

Kubernets를 따로 설치하는 공수를 줄이기 위해서 AWS에서 제공하는 관리형 Kubernetes인 EKS를 사용하기로 했다.  
EKS를 사용하면 클러스터 생성과 제거가 자유롭다. 노드들의 성능도 그때 그때 바꿔서 테스트를 할 수 있고 

Kubeflow를 세팅하는 과정에서 설정이 꼬여서 클러스터 자체를 날려버리고 싶을 때가 많았다.  
그래서 클러스터와 노드그룹, Kubeflow를 설치하는 간단한 쉘 스크립트를 짜서 Makefile로 실행되게 해두었다.  

로컬 환경은 macOS Catalina 10.15.5 이다.

## EKS Elastic Kubernetes Service

### eksctl

eksctl은 AWS에서 쿠버네티스를 관리하기 위한 커맨드라인 도구이다.  
설치 방법은 [여기](https://docs.aws.amazon.com/ko_kr/eks/latest/userguide/getting-started-eksctl.html) 잘 설명되어 있다.  
커맨드 라인에서 아래 코드를 실행하고  

```bash
eksctl create cluster --name ${CLUSTERNAME} --region ${REGION} --zones {ZONES}
```

설정값을 세팅해준다. 
```bash
aws eks --region ${REGION} update-kubeconfig --name ${CLUSTERNAME}
```

### kubectl 

또한 Kubernetes는 클러스터 API 서버와 통신하기 위해 kubectl이라는 커맨드라인 도구를 사용한다.   
쿠베..컨트롤..? 이라고 부르는 것 같다.  
위의 문서를 보았다면 kubectl도 같이 설치가 되었을 것이다.  
잘 작동하는 지 확인하기 위해 네임스페이스를 get 해보자. 
```bash
kubectl get ns
```
여기서 ns는 namespace를 의미한다.  
해당 클러스터에 속한 네임스페이스들이 출력될 것이다. 

클러스터에 속한 노드들이 잘 있는 지도 한번 확인해보자. 
```bash
eksctl get nodegroups --cluster {CLUSTERNAME}
```

잘 생성이 된 것 같다.  
AWS에서 어떤 과정을 거쳐서 EKS 클러스터가 생성되었는 지 궁금하면 CloudFormation 메뉴를 가보면 방금 생성한 클러스터가 AWS 내부에서 어떤 과정을 거쳐서 생성이 되었고  
현재 네트워크 구조라던지 생긴 모양이 어떤 지도 시각화된 모양으로 볼 수 있다.  

이런 저런 내용이 잘 안되었을 때 맘에 안들면 여기서 그냥 삭제해버려도 된다.  
생성할 때 만들어진 AWS에서 관리하는 템플릿을 기반으로 삭제해버리는 것 같다. (맞나?)

### Nodegroups

방금 생성 한 건 마스터 노드이다.   
(혹시나 이 글을 읽어주시는 분들이 계시다면 몹시 죄송합니다만 이건 뉴비의 후기글이고 잘 돌아가는 건 확인했습니다만 Kubernetes도 올해 처음 해봤기 때문에 이론적으로 매우 부족합니다.)
실제 일을 할 노드 그룹을 추가해야 한다. AWS 기준으로는 EC2에 가보면 마스터 노드 역할을 하는 인스턴스가 두 개 떠있는 모습을 볼 수 있다.  

직접 클러스터를 세팅하는 것과는 다르게 AWS는 완전 관리형이라지만 GKE와는 또 다른 것 같다. GKE는 저런 마스터 노드의 모습도 확인할 수 없다는 것 같다..  그냥 알아서 잘 관리되겠거니 인 것 같다...

하둡하면서는 워커 노드라는 용어를 썼었나..? 직접 안쓰고 공부만 하다보니 기억이 잘 안난다.  
아무튼 생성해보자. 

```bash
eksctl create nodegroup --cluster ${CLUSTER_NAME} --version ${KUBERNETESVERSION} --name ${NODENAME} --node-type ${NODETYPE} --nodes {HOWMANYNODES} --nodes-min {MINIMUM} --nodes-max {MAXIMUM} --node-volume-size {VOLUMESIZE} --ssh-public-key ${MYKEYPAIR} --managed
```
아까 만든 클러스터 이름을 지정해주고, Kubernetes 버젼도 지정해준다. 이 버젼 녀석은 매우 민감하다.  
Kubeflow와 KFServing도 각 버젼에 따라 돌아가는 게 있고 안 돌아가는 게 있기 때문에 고통스럽고 길고 왜 하는 지도 모르겠는 삽질을 하고 싶지 않다면 반드시 버젼에 유의해야 한다.  

그리고 노드이름와 워커노드(이런 용어를 사용해도 되는 지는 모르겠다만)로 사용할 인스턴스의 타입을 지정해준다.  
인스턴스의 타입도 꽤나 잘 살펴보아야 한다.  

특히 ML플랫폼은 GPU를 사용여부가 트레이닝이나 추론에 영향을 크게 미치기 때문에 AWS의 인스턴스에 익숙하지 않은 사람이라면 인스턴스의 목록과 GPU가 박혀있는 지,  그리고 (그 무시무시한) 가격까지 함께 확인해야 한다.  

볼륨 사이즈는 기본적으로 EC2의 인스턴스에 탑재하는 EBS 사이즈인 것 같다.   
--managed는 이걸 완전 관리형으로 사용하는 지에 대한 옵션인 것 같다. 이 옵션을 넣어주지 않으면 콘솔창에 노드그룹이 보이지 않았다. 



## Kubeflow

AWS에 Kubeflow를 설치하기 위해 [이 문서](https://www.kubeflow.org/docs/aws/deploy/install-kubeflow/)를 참고 하였다. 잘 따라하면 설치하는 데 문제는 없을 것이다. 

이 문서에서 명시하고 있는 Prerequisites 은 이미 다 세팅이 되어있다.  
이제 kfctl을 다운받아야 한다. kfctl is the control plane for deploying and managing Kubeflow 이라고 문서에 설명이 되어있다. 
정확히 어떻게 번역을 해야 와닿을지를 모르겠어서 그냥 영어 문장을 적어두었다. 컨트롤 플레인이란다.  
릴리즈된 버젼들은 [여기](https://github.com/kubeflow/kfctl/releases/tag/v1.0.2)서 볼 수 있고 다운을 받아보자.  

```bash
curl -LO https://github.com/kubeflow/kfctl/releases/download/v1.0.2/kfctl_v1.0.2-0-ga476281_darwin.tar.gz
tar -xvf kfctl_v1.0.2-0-ga476281_darwin.tar.gz
```

지우고 생길 때마다 편리한 관리를 위해서 난 따로 deployment 폴더를 만들었다.  
```bash
BASEDIR = ./kube_deployment
KFDIR = ${BASEDIR}/${CLUSTERNAME}

mkdir -p ${KFDIR}
```

그리고 Kubeflow 설정 파일을 다운받자. YAML파일로 되어 있는데, 이 때는 옵션이 하나 더 있다.  
AWS의 인증 기능인 Cognito를 사용하려면 다른 파일을 받아야 한다.  
그걸로도 깔아서 Cognito 세팅이 가능한지 보기는 했는데, 서비스를 AWS에 올리지는 않을 거라 나에게는 굳이 필요하진 않았다. 
```bash
wget -O ${KFDIR}/kfctl_aws.yaml https://raw.githubusercontent.com/kubeflow/manifests/v1.0-branch/kfdef/kfctl_aws.v1.0.2.yaml
```

문서에 보면 Option 1: Use IAM For Service Account 라는 부분이 있다.  
AWS IAM을 Kubernetes 내 Service Account로 사용하게 도와준다는 것 같다. (맞나?)  
그걸 위해 다운받은 설정 문서에 몇 부분을 바꿔주자. 

```bash
sed -i -e 's/region: us-west-2/region: us-east-1/g' ${KFDIR}/kfctl_aws.yaml
sed -i -e 's/roles:/enablePodIamPolicy: true/g' ${KFDIR}/kfctl_aws.yaml
sed -i -e '/eksctl/d' ${KFDIR}/kfctl_aws.yaml
```
나는 버지니아에서 쓸 거라서 us-east-1으로 했다. 

그리고 배포를 하자.
```bash
./kfctl apply -V -f ${KFDIR}/kfctl_aws.yaml
```  

아마 잘 되었을 것이다. 잘 된건지 확인을 해보자. 

```bash
kubectl -n kubeflow get all
```

kubectl로  kubeflow라는 네임스페이스에 있는 컴포넌트를 다 출력하는 명령이다.  
KFServing도 같이 거기 깔렸을 텐데..   
이 문서가 자주 업데이트 되지는 않는 모양이라.. KFServing도 계속 업데이트 중이고.. 오늘 기준으로 0.4.0이 릴리즈 되어있다. 그런데 이렇게 깔면 아마 0.2.2가 깔렸을 것이다.

처음에는 이렇게 그대로 쓰다가 나중에는 자동으로 깔린 KFServing을 지워버리고 그냥 새 버젼을 받아서 쓰게 되었다.   
그에 대해서는 다음 글에 써야겠다. 블로그에 올리는 첫 글인데 쓰다보니 생각보다 글이 길어졌다. 
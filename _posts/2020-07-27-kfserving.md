---
layout: post
title: EKS에 Kubeflow와 KFServing을 설치한 후기
summary: 테스트용
featured-img: office1
categories: [Devlog]
---

# EKS에 Kubeflow와 KFServing을 설치한 후기

딥러닝 모델 서빙용으로 KFServing을 사용할 수 있을 지를 테스트하게 되었다.  
Kubeflow 라는 이름부터 생소한 상황이라 이런 저런 삽질을 많이 했고 그 과정을 기억하기 위해 이 글을 쓴다.   

### EKS를 사용하는 이유

Kubernets를 따로 설치하는 공수를 줄이기 위해서 AWS에서 제공하는 관리형 Kubernetes인 EKS를 사용하기로 했다.  

EKS를 사용하면 클러스터 생성과 제거가 자유롭다. 노드들의 성능도 그때그때 바꿔서 테스트를 할 수 있고 

Kubeflow를 세팅하는 과정에서 설정이 꼬여서 클러스터 자체를 날려버리고 싶을 때가 많았다.  
그래서 클러스터와 노드그룹, Kubeflow를 설치하는 간단한 쉘 스크립트를 짜서 Makefile로 실행되게 해두었다.  

로컬 환경은 macOS Catalina 10.15.5 이다.


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








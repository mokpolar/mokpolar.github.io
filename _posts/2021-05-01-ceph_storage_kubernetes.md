---
layout: post
no_hidden: true
title: Ceph를 쿠버네티스에 설치해서 Object Storage로 사용한 후기 (install ceph object storage on kubernetes)
summary: 쿠버네티스에서 머신러닝 모델과 도커 이미지들을 관리할 수 있는 stateful 한 공간이 필요했다...
featured-img: ceph
categories: [Devlog]
author: mokpolar
sitemap:
    changefreq: daily
    priority: 1.0
---

# Ceph를 쿠버네티스에 설치해서 Object Storage로 사용한 후기 (install ceph object storage on kubernetes)

## 사전 정보

### 왜 Ceph를 설치하게 되었나?

쿠버네티스에서 머신러닝 모델과 도커 이미지들을 관리할 수 있는 stateful 한 공간이 필요했다.  
만약 GKE나 EKS 같이 퍼블릭 클라우드의 Managed Kuberenetes만 사용한다면 좀 더 선택지가 많겠지만 나는 On-premise에 쿠버네티스 클러스터를 설치하는 경우까지 고려해야 했다. 

S3 API를 사용할 수 있는 확장 가능한 S3 Compatible Object Storage는 MinIO도 좋은 선택지였겠지만 라이센스 문제가 있었다. ([MinIO 설치에 대한 이전 글](https://mokpolar.github.io/minio_distribuited_1/))  
그래서 Ceph를 쿠버네티스에 설치하고 Harbor의 백엔드로 사용하려고 한다. ([MinIO로 Harbor의 백엔드를 연동하는 이전 글](https://mokpolar.github.io/harbor_minio_standalone/))

쿠버네티스에 올리려면 설치와 관리 자체는 MinIO 보다 더 복잡하고 어려워보인다.  
하지만 다행히 Rook이라는 스토리지 오케스트레이션 도구가 존재한다.  

Rook 오퍼레이터를 쿠버네티스에 배포하고 시작하면 된다.  
[Rook Github](https://github.com/rook/rook)를 보면 Ceph는 Stable하다.   
설치 과정은 [Rook 공식 문서](https://rook.io/docs/rook/v1.6/ceph-storage.html)를 참고했다.


### 준비물

* 쿠버네티스 클러스터 - GKE를 사용했다. 최소 3개의 노드가 필요하다. 
* GCE Persistent Disk - GKE에서 PVC로 동적으로 공간을 늘리려고 사용해봤다. 없어도 된다.

## 설치 과정

### Deploy the Rook Operator  

먼저 Rook을 클론해오자. 
```bash
git clone --single-branch --branch v1.6.1 https://github.com/rook/rook.git
cd rook/cluster/examples/kubernetes/ceph
```
그리고 배포한다. 
```bash
kubectl create -f crds.yaml -f common.yaml -f operator.yaml
```

### Create a Rook Ceph Cluster

1 cluster.yaml  
여기서 분기가 나뉜다.   
cluster.yaml로 그대로 배포하면 노드에 있는 공간을 사용한다. 

```bash
kubectl create -f cluster.yaml
```

2 cluster-on-pvc.yaml  
GKE 환경이므로 dynamic하게 볼륨의 이용이 가능하다. 

GCP Persistent Disk를 통해서 동적으로 공간을 늘려가기 위해 
cluster-on-pvc.yaml을 사용했다. 

그 전에 GCP Persistent Disk를 가져오도록 StorageClass를 생성해준다. 

```yaml
# storageclass.yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: gp2
provisioner: kubernetes.io/gce-pd
parameters:
  type: pd-standard
  fstype: ext4
  replication-type: none
```

```bash
kubectl create -f storageclass.yaml cluster-on-pvc.yaml
```

그리고 배포가 잘 되었는지 확인해주자.

```bash
kubectl get pod -n rook-ceph
NAME                                                              READY   STATUS    RESTARTS   AGE
csi-cephfsplugin-4qdjb                                            3/3     Running   0          2d9h
csi-cephfsplugin-98wvn                                            3/3     Running   0          2d9h
csi-cephfsplugin-bqqk6                                            3/3     Running   0          2d9h
csi-cephfsplugin-m9sr9                                            3/3     Running   0          2d9h
csi-cephfsplugin-provisioner-7cbcfdc5b9-2flzd                     6/6     Running   0          2d9h
csi-cephfsplugin-provisioner-7cbcfdc5b9-lxpvz                     6/6     Running   0          2d9h
csi-cephfsplugin-x488j                                            3/3     Running   0          2d9h
csi-rbdplugin-7jvs4                                               3/3     Running   0          2d9h
csi-rbdplugin-cng59                                               3/3     Running   0          2d9h
csi-rbdplugin-kc67n                                               3/3     Running   0          2d9h
csi-rbdplugin-provisioner-7675f97656-24l9h                        6/6     Running   0          2d9h
csi-rbdplugin-provisioner-7675f97656-pnzcw                        6/6     Running   0          2d9h
csi-rbdplugin-rgkdz                                               3/3     Running   0          2d9h
csi-rbdplugin-s2wbv                                               3/3     Running   0          2d9h
rook-ceph-crashcollector-21a1aba55a2e76cd95c92a38a737fc14-h8ztz   1/1     Running   0          2d9h
rook-ceph-crashcollector-42c6c5ece4b6fd78701a02cb91da8e79-xlfth   1/1     Running   0          2d9h
rook-ceph-crashcollector-f13f0c5da66cf119202b0c6ff71ccc06-scdrc   1/1     Running   0          2d9h
rook-ceph-mgr-a-5669b489d5-hj8pj                                  1/1     Running   0          2d9h
rook-ceph-mon-a-7f8f5c577c-9k7bt                                  1/1     Running   0          2d9h
rook-ceph-mon-b-77968b5fb4-rskpl                                  1/1     Running   0          2d9h
rook-ceph-mon-c-79df5cc79f-ml8t4                                  1/1     Running   0          2d9h
rook-ceph-operator-547cd645bc-2nvpr                               1/1     Running   0          2d9h
rook-ceph-osd-0-5fffd96548-gskvz                                  1/1     Running   0          2d9h
rook-ceph-osd-1-5d6fb5c7b8-pqkwf                                  1/1     Running   0          2d9h
rook-ceph-osd-2-58b54b5c4b-s7v5n                                  1/1     Running   0          2d9h
```

### Ceph Cluster 상태 확인

Ceph Cluster의 상태 확인을 하기 위해 rook toolbox pod를 배포할 수 있다.

```bash
kubectl -n rook-ceph create -f toolbox.yaml
```

그리고 해당 파드에 접근해서 상태를 확인해볼 수 있다. 
```
kubectl exec -it -n rook-ceph [toolbox pod name] -- bash

ceph status

  cluster:
    id:     
    health: HEALTH_OK

  services:
    mon: 3 daemons, quorum a,b,c (age 2d)
    mgr: a(active, since 2d)
    osd: 3 osds: 3 up (since 2d), 3 in (since 2w)
    rgw: 1 daemon active (my.store.a)

  task status:

  data:
    pools:   8 pools, 81 pgs
    objects: 8.79k objects, 27 GiB
    usage:   84 GiB used, 216 GiB / 300 GiB avail
    pgs:     81 active+clean

  io:
    client:   5.2 KiB/s rd, 682 B/s wr, 5 op/s rd, 4 op/s wr

ceph osd status

ID  HOST                                          USED  AVAIL  WR OPS  WR DATA  RD OPS  RD DATA  STATE
 0  gke-ceph-cluster-default-pool-42b74749-0ytu  28.0G  71.9G      0        0       0        0   exists,up
 1  gke-ceph-cluster-default-pool-42b74749-txwv  28.0G  71.9G      0        0       0        0   exists,up
 2  gke-ceph-cluster-default-pool-42b74749-8k9b  28.0G  71.9G      0        0       0        0   exists,up
```


### Configure an Object Store

S3 API를 통해 Ceph Cluster를 사용하기 위해 Object Store도 배포해주어야 한다.

```bash
kubectl create -f object.yaml -n rook-ceph
```


### Create a Bucket

Object Store가 설정되고 나면 클라이언트가 오브젝트를 읽고 쓸 수 있게 Bucket도 생성해주어야 한다.

```bash
kubectl create -f storageclass-bucket-delete.yaml -n rook-ceph

kubectl create -f object-bucket-claim-delete.yaml -n rook-ceph
```

### Access External to the Cluster

Bucket을 생성한다고 외부에서 읽고 쓸 수 있는 게 아니다.  
Harbor의 backend로 사용하거나 S3 API를 통해서 접근해서 사용하기 위해서는 Service를 열어주어야 한다.  

GKE 환경이므로 loadbalancer 형태로 쉽게 접근할 수 있게 열어주자.  

```yaml
# rgw-external.yaml
apiVersion: v1
kind: Service
metadata:
  name: rook-ceph-rgw-my-store-external
  namespace: rook-ceph 
  labels:
    app: rook-ceph-rgw
    rook_cluster: rook-ceph 
    rook_object_store: my-store
spec:
  ports:
  - name: rgw
    port: 80 
    protocol: TCP
    targetPort: 8080
  selector:
    app: rook-ceph-rgw
    rook_cluster: rook-ceph 
    rook_object_store: my-store
  sessionAffinity: None
  type: LoadBalancer
```

```bash
kubectl create -f rgw-external.yaml 
```

접근 가능한 endpoint가 생성된 것을 볼 수 있다.  
이제 이 endpoint를 통해서 S3 API를 사용할 수 있다. 
```bash
kubectl get svc -n rook-ceph

NAME                                   TYPE           CLUSTER-IP     EXTERNAL-IP       PORT(S)             AGE
...
rook-ceph-rgw-my-store-external        LoadBalancer   XX.XXX.XXX.XXX   XX.XXX.XXX.XXX       80:30644/TCP        17d
```



### Reference

* https://rook.io/docs/rook/v1.6/ceph-storage.html
* https://github.com/rook/rook


혹시 내용에 잘못 된 부분이 있으면 Disqus로 댓글 달아주시면 감사하겠습니다!

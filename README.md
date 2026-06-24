# End to End ReactJs deployment

This readme file contains all the necessary step to run a reactJs app using Github actions as CI and ArgoCD as CD.

It is better to run this on EC2 instance so that so we dont need to install all the software in our local machine.

## Installation
Install all the packages.

```bash
# install Docker 
sudo apt update

sudo apt install -y docker.io

sudo usermod -aG docker $USER


# install Kubectl

sudo apt-get update

sudo apt-get install -y apt-transport-https ca-certificates curl gnupg -y

curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.36/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg

sudo chmod 644 /etc/apt/keyrings/kubernetes-apt-keyring.gpg # allow unprivileged APT programs to read this keyring

echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.36/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list

sudo chmod 644 /etc/apt/sources.list.d/kubernetes.list   # helps tools such as command-not-found to work correctly

sudo apt-get update

sudo apt-get install -y kubectl 


# Install JAVA

sudo apt update

sudo apt install -y default-jre

java -version


# Install AWSCLI
sudo apt -y update

sudo apt install unzip

curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"

unzip awscliv2.zip

sudo ./aws/install


# Install terraform (if you are using eks cluster)

# Update package list and install dependencies
sudo apt update && sudo apt install -y gnupg software-properties-common curl

# Download and add the official HashiCorp GPG key
curl -fsSL https://apt.releases.hashicorp.com/gpg | gpg --dearmor | sudo tee /usr/share/keyrings/hashicorp-archive-keyring.gpg > /dev/null

# Add the official HashiCorp repository to your system sources
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list

# Update package lists again and install Terraform
sudo apt update && sudo apt install -y terraform


# Install trivy
sudo apt update

curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sudo sh -s -- -b /usr/local/bin v0.71.1

sudo apt-get install wget gnupg
wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | gpg --dearmor | sudo tee /usr/share/keyrings/trivy.gpg > /dev/null
echo "deb [signed-by=/usr/share/keyrings/trivy.gpg] https://aquasecurity.github.io/trivy-repo/deb generic main" | sudo tee -a /etc/apt/sources.list.d/trivy.list
sudo apt-get update
sudo apt-get install trivy


# run sonarqube using docker
sudo apt update

newgrp docker

docker ps

docker run -d --name sonarqube -p 9000:9000 sonarqube
```

# CI process of The App

In you github repo, add .github/workflows/<build_name>.yaml

checkout the yaml file to understand what is going on the workflow.

To create a successful pipeline, we need to create a sonarqube_host and sonarqube_token  as well as DOCKER_USERNAME and DOCKER_PAT. To create, navigate to the setting in the repo, and go to secrets and variables and create them.

To get the sonarqube_host and sonarqube_token, we must open the sonarqube app and get it from there. And follow the instruction from sonarqube app instruction.


## create a config.yaml file and install the kind cluster to run in your ec2

```bash
# install kind in your ec2
# For AMD64 / x86_64
[ $(uname -m) = x86_64 ] && curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.32.0/kind-linux-amd64
# For ARM64
[ $(uname -m) = aarch64 ] && curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.32.0/kind-linux-arm64
chmod +x ./kind
sudo mv ./kind /usr/local/bin/kind
```

```bash

# config.yaml

kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4

nodes:
- role: control-plane
  extraPortMappings:
  - containerPort: 80
    hostPort: 80
    protocol: TCP
  - containerPort: 443
    hostPort: 443
    protocol: TCP

- role: worker
- role: worker
- role: worker
```

```bash
kind create cluster --config config.yaml
```


## install ingress-nginx controller

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml
```
## Check if ingress-nginx controller is working

```bash
kubectl get pods -n ingress-nginx
```
### By default the ingress-nginx controller is installed on worker node, so we need to install it on the control-plane so that we can route to the app.

```bash
kubectl patch deployment ingress-nginx-controller \
  -n ingress-nginx \
  --type='json' \
  -p='[
    {
      "op":"add",
      "path":"/spec/template/spec/nodeSelector",
      "value":{
        "kubernetes.io/hostname":"kind-control-plane"
      }
    }
  ]' 
```
### Restart the controller
```bash
kubectl rollout restart deployment ingress-nginx-controller -n ingress-nginx
```
Check if it is installed on control-plane
```bash
kubectl get pods -n ingress-nginx -o wide
```


## install Helm

```bash
curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-4
chmod 700 get_helm.sh
./get_helm.sh

OR 

curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-4 | bash
```

## install Kyverno cluster policy crd to disallow latest tag to be used.


```bash
helm repo add kyverno https://kyverno.github.io/kyverno/
helm repo update
helm install kyverno kyverno/kyverno -n kyverno --create-namespace
```

## Install ArgoCD

```bash
kubectl create namespace argocd

kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

kubectl get all -n argocd

kubectl port-forward --address 0.0.0.0 svc/argocd-server -n argocd 8080:443
```

## By default the secret of argocd is encoded in base64, so we need to decode it.

```bash
kubectl get secret argocd-initial-admin-secret -n argocd -o yaml
```
Decode the secret using,
```bash
echo -n "secret" | base64 -d 

# -n is used so that there is no trailing new line and -d is for decode
```

## Apply the argocd file from the repository.
```bash
kubectl apply -f argocd.yaml
```

Refresh the page in the browser of argocd.



# If you are using eks cluster.
```bash
# Add your access and secret key from AWS IAM.
aws configure

# Verify your identity

aws sts get-caller-identity

# Add your cluster config in ~/.kube/config.file using

aws eks update-kubeconfig --region 'your_region_name' --name 'your_eks_cluster_name'

# For example, aws eks update-kubeconfig --region us-east-1 --name my-eks-cluster

```

## After using your cluster, make sure to terminate all your aws resources like ec2, and EKS cluster.
```bash
terraform destroy
# If you are using terraform to create resources
```


To View all the logs files, login to the sonarqube app to check the quality of the code and to check the fs quality and image vunerability, navigate to security and quality of github repo.


## Contributing

## License

[MIT](https://choosealicense.com/licenses/mit/)
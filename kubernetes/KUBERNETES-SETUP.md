KUBERNETES SETUP


DELETE ALL CLUSTER so that there is no conflict between clusters
START FRESH 

1. kind create cluster --config config.yaml

2. kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml

this is a ingress controller that is installed in out cluster


3. kubectl logs -n ingress-nginx deploy/ingress-nginx-controller -f
check if the ingress-nginx is working and run http://localhost/ in different terminal


4. kubectl get ingress 

5. kubectl get pods -n ingress-nginx
check if ingress-nginx pod is working



    if using eks then 

6.  kubectl edit svc ingress-nginx-controller -n ingress-nginx

    change from
    --publish-service=localhost
    to 
    --publish-service=$(POD_NAMESPACE)/ingress-nginx-controller

7. also install kyverno crd using helm

    helm repo add kyverno https://kyverno.github.io/kyverno/
    helm repo update
    helm install kyverno kyverno/kyverno -n kyverno --create-namespace

8. install argo cd

    kubectl create namespace argocd

    kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

    kubectl get all -n argocd

    kubectl port-forward --address 0.0.0.0 svc/argocd-server -n argocd 8080:443

    kubectl get secret argocd-initial-admin-secret -n argocd -o yaml

    echo "secret" | base64 decode



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


  kubectl rollout restart deployment ingress-nginx-controller -n ingress-nginx

  kubectl get pods -n ingress-nginx -o wide



kubectl port-forward --address 0.0.0.0 -n my-namespace svc/frontend-service 8081:80


install HELM

curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-4
chmod 700 get_helm.sh
./get_helm.sh

OR

curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-4 | bash

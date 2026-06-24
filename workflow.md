## Architecture Overview

```bash
Developer
    |
    v
GitHub Repository
    |
    | (Push / Pull Request)
    v
GitHub Actions Pipeline
(Self-hosted GitHub Runner)
    |
    +--> Code Quality Scan (SonarQube)
    |
    +--> Security Scan (Trivy)
    |
    +--> Build Docker Image
    |
    +--> Push Image to Docker Hub
    |
    +--> Update Kubernetes Manifest/Helm Chart
    |
    v
GitHub GitOps Repository
    |
    v
Argo CD
    |
    v
AWS EKS Cluster
    |
    +--> Application Pods
    +--> Prometheus Monitoring
    +--> Grafana Dashboards
```
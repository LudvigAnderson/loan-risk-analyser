FROM nvidia/cuda:12.9.1-cudnn-runtime-ubuntu24.04 AS build

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    python3 python3-venv python3-pip python3-dev build-essential && \
    rm -rf /var/lib/apt/lists/*


ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY requirements.txt .
RUN python3 -m venv /venv && \
    /venv/bin/pip install --upgrade pip setuptools wheel && \
    /venv/bin/pip install -r requirements.txt

COPY . .
RUN /venv/bin/pip install .

FROM nvidia/cuda:12.9.1-cudnn-runtime-ubuntu24.04 AS runtime

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

#ENV CUDA_VISIBLE_DEVICES=0

ENV NVARCH=x86_64
ENV NVIDIA_REQUIRE_CUDA=cuda>=12.9 brand=unknown,driver>=535,driver<536 brand=grid,driver>=535,driver<536 brand=tesla,driver>=535,driver<536 brand=nvidia,driver>=535,driver<536 brand=quadro,driver>=535,driver<536 brand=quadrortx,driver>=535,driver<536 brand=nvidiartx,driver>=535,driver<536 brand=vapps,driver>=535,driver<536 brand=vpc,driver>=535,driver<536 brand=vcs,driver>=535,driver<536 brand=vws,driver>=535,driver<536 brand=cloudgaming,driver>=535,driver<536 brand=unknown,driver>=550,driver<551 brand=grid,driver>=550,driver<551 brand=tesla,driver>=550,driver<551 brand=nvidia,driver>=550,driver<551 brand=quadro,driver>=550,driver<551 brand=quadrortx,driver>=550,driver<551 brand=nvidiartx,driver>=550,driver<551 brand=vapps,driver>=550,driver<551 brand=vpc,driver>=550,driver<551 brand=vcs,driver>=550,driver<551 brand=vws,driver>=550,driver<551 brand=cloudgaming,driver>=550,driver<551 brand=unknown,driver>=560,driver<561 brand=grid,driver>=560,driver<561 brand=tesla,driver>=560,driver<561 brand=nvidia,driver>=560,driver<561 brand=quadro,driver>=560,driver<561 brand=quadrortx,driver>=560,driver<561 brand=nvidiartx,driver>=560,driver<561 brand=vapps,driver>=560,driver<561 brand=vpc,driver>=560,driver<561 brand=vcs,driver>=560,driver<561 brand=vws,driver>=560,driver<561 brand=cloudgaming,driver>=560,driver<561 brand=unknown,driver>=565,driver<566 brand=grid,driver>=565,driver<566 brand=tesla,driver>=565,driver<566 brand=nvidia,driver>=565,driver<566 brand=quadro,driver>=565,driver<566 brand=quadrortx,driver>=565,driver<566 brand=nvidiartx,driver>=565,driver<566 brand=vapps,driver>=565,driver<566 brand=vpc,driver>=565,driver<566 brand=vcs,driver>=565,driver<566 brand=vws,driver>=565,driver<566 brand=cloudgaming,driver>=565,driver<566 brand=unknown,driver>=570,driver<571 brand=grid,driver>=570,driver<571 brand=tesla,driver>=570,driver<571 brand=nvidia,driver>=570,driver<571 brand=quadro,driver>=570,driver<571 brand=quadrortx,driver>=570,driver<571 brand=nvidiartx,driver>=570,driver<571 brand=vapps,driver>=570,driver<571 brand=vpc,driver>=570,driver<571 brand=vcs,driver>=570,driver<571 brand=vws,driver>=570,driver<571 brand=cloudgaming,driver>=570,driver<571
ENV NV_CUDA_CUDART_VERSION=12.9.79-1
ENV CUDA_VERSION=12.9.1
ENV PATH=/usr/local/cuda/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
ENV LD_LIBRARY_PATH=/usr/local/cuda/lib64
ENV NVIDIA_VISIBLE_DEVICES=all
ENV NVIDIA_DRIVER_CAPABILITIES=compute,utility
ENV NV_CUDA_LIB_VERSION=12.9.1-1
ENV NV_NVTX_VERSION=12.9.79-1
ENV NV_LIBNPP_VERSION=12.4.1.87-1
ENV NV_LIBNPP_PACKAGE=libnpp-12-9=12.4.1.87-1
ENV NV_LIBCUSPARSE_VERSION=12.5.10.65-1
ENV NV_LIBCUBLAS_PACKAGE_NAME=libcublas-12-9
ENV NV_LIBCUBLAS_VERSION=12.9.1.4-1
ENV NV_LIBCUBLAS_PACKAGE=libcublas-12-9=12.9.1.4-1
ENV NV_LIBNCCL_PACKAGE_NAME=libnccl2
ENV NV_LIBNCCL_PACKAGE_VERSION=2.27.3-1
ENV NCCL_VERSION=2.27.3-1
ENV NV_LIBNCCL_PACKAGE=libnccl2=2.27.3-1+cuda12.9
ENV NVIDIA_PRODUCT_NAME=CUDA
ENV NV_CUDA_LIB_VERSION=12.9.1-1
ENV NV_CUDA_CUDART_DEV_VERSION=12.9.79-1
ENV NV_NVML_DEV_VERSION=12.9.79-1
ENV NV_LIBCUSPARSE_DEV_VERSION=12.5.10.65-1
ENV NV_LIBNPP_DEV_VERSION=12.4.1.87-1
ENV NV_LIBNPP_DEV_PACKAGE=libnpp-dev-12-9=12.4.1.87-1
ENV NV_LIBCUBLAS_DEV_VERSION=12.9.1.4-1
ENV NV_LIBCUBLAS_DEV_PACKAGE_NAME=libcublas-dev-12-9
ENV NV_LIBCUBLAS_DEV_PACKAGE=libcublas-dev-12-9=12.9.1.4-1
ENV NV_CUDA_NSIGHT_COMPUTE_VERSION=12.9.1-1
ENV NV_CUDA_NSIGHT_COMPUTE_DEV_PACKAGE=cuda-nsight-compute-12-9=12.9.1-1
ENV NV_NVPROF_VERSION=12.9.79-1
ENV NV_NVPROF_DEV_PACKAGE=cuda-nvprof-12-9=12.9.79-1
ENV NV_LIBNCCL_DEV_PACKAGE_NAME=libnccl-dev
ENV NV_LIBNCCL_DEV_PACKAGE_VERSION=2.27.3-1
ENV NCCL_VERSION=2.27.3-1
ENV NV_LIBNCCL_DEV_PACKAGE=libnccl-dev=2.27.3-1+cuda12.9
ENV LIBRARY_PATH=/usr/local/cuda/lib64/stubs
ENV NV_CUDNN_VERSION=9.10.2.21-1
ENV NV_CUDNN_PACKAGE_NAME=libcudnn9-cuda-12
ENV NV_CUDNN_PACKAGE=libcudnn9-cuda-12=9.10.2.21-1
ENV NV_CUDNN_PACKAGE_DEV=libcudnn9-dev-cuda-12=9.10.2.21-1
ENV NV_CUDNN_PACKAGE_DEV_HEADERS=libcudnn9-headers-cuda-12=9.10.2.21-1


COPY --from=build /venv /venv
ENV PATH="/venv/bin:$PATH"

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    python3 && \
    rm -rf /var/lib/apt/lists/*

COPY . .

ENTRYPOINT ["python", "main.py"]
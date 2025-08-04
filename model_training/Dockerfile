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
ENV NVIDIA_VISIBLE_DEVICES=all
ENV NVIDIA_DRIVER_CAPABILITIES=compute,utility

COPY --from=build /venv /venv
ENV PATH="/venv/bin:$PATH"

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    python3 && \
    rm -rf /var/lib/apt/lists/*

COPY . .

ENTRYPOINT ["python", "main.py"]
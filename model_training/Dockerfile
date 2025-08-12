FROM nvidia/cuda:12.4.1-cudnn-runtime-ubuntu20.04 AS build
WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    python3 python3-venv python3-pip python3-dev build-essential libgomp1 && \
    rm -rf /var/lib/apt/lists/*


ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY requirements.txt .
RUN python3 -m venv /venv && \
    /venv/bin/pip install --upgrade pip setuptools wheel && \
    /venv/bin/pip install -r requirements.txt

    

FROM nvidia/cuda:12.4.1-cudnn-runtime-ubuntu20.04 AS runtime

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY --from=build /venv /venv
ENV PATH="/venv/bin:$PATH"

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    python3 libgomp1 && \
    rm -rf /var/lib/apt/lists/*

COPY . .

ENTRYPOINT ["python", "main.py"]
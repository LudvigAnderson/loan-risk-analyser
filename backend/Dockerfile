FROM python:3.11.13-slim-bookworm AS build
WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential && \
    rm -rf /var/lib/apt/lists/*

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY requirements.txt .
RUN python3 -m venv /venv && \
    /venv/bin/pip install --upgrade pip setuptools wheel && \
    /venv/bin/pip install -r requirements.txt

FROM python:3.11.13-slim-bookworm AS runtime
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY --from=build /venv /venv
ENV PATH="/venv/bin:$PATH"

COPY . .

ENTRYPOINT ["python", "run.py"]
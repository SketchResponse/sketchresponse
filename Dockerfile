FROM node:14 AS frontend-builder
WORKDIR /app/sketch_tool
COPY sketch_tool/package.json sketch_tool/package-lock.json ./
RUN npm ci --unsafe-perm=true
COPY sketch_tool .
COPY LICENSE ..
RUN npm run build

FROM python:3.8
WORKDIR /app/sketchresponse
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
COPY --from=frontend-builder \
  /app/static/sketch_tool_dist static/sketch_tool_dist
WORKDIR /app
EXPOSE 5000
ENV FLASK_APP=sketchresponse.server \
  FLASK_RUN_HOST=0.0.0.0 \
  FLASK_RUN_PORT=5000 \
  FLASK_DEBUG=1
CMD ["flask", "run"]

FROM node:8 AS frontend-builder
WORKDIR /app/sketch_tool
COPY sketch_tool/package.json sketch_tool/config.js ./
RUN npm install --unsafe-perm=true
COPY sketch_tool .
COPY LICENSE ..
RUN npm run build

FROM python:2.7
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
COPY --from=frontend-builder \
  /app/static/sketch_tool_dist static/sketch_tool_dist
EXPOSE 5000
ENV FLASK_APP=server.py FLASK_DEBUG=1 PYTHONPATH=/app
CMD ["flask", "run", "-h 0.0.0.0"]

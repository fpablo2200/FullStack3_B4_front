# Etapa 1: build
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./

# Instala dependencias
RUN npm ci --silent

COPY . .

RUN npm run build -- --configuration production

FROM nginx:stable-alpine AS runtime

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN rm -rf /usr/share/nginx/html/*


COPY --from=build /app/dist/ClinicaApp/browser/ /usr/share/nginx/html/
RUN mv /usr/share/nginx/html/index.csr.html /usr/share/nginx/html/index.html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
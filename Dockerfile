FROM node:22.3-alpine AS build
WORKDIR /app
COPY package.json package-lock.json angular.json tsconfig.json tsconfig.app.json tsconfig.spec.json ./
RUN npm install
COPY . .
RUN npm run build --configuration=production

FROM nginx:1.27-alpine
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY nginx/proxy_params /etc/nginx/proxy_params
COPY --from=build /app/dist/advertisements-fe/browser /app/frontend

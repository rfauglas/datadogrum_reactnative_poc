# Use a base image with build tools installed
FROM debian:buster as builder

# Set the version of Nginx and the ngx_http_proxy_connect_module
ENV NGINX_VERSION 1.21.6
ENV MODULE_VERSION 0.0.1

# Install dependencies and tools for building Nginx
RUN apt-get update && apt-get install -y \
    build-essential \
    libpcre3 \
    libpcre3-dev \
    zlib1g \
    zlib1g-dev \
    libssl-dev \
    wget \
    git

# Download the Nginx source code
RUN wget http://nginx.org/download/nginx-${NGINX_VERSION}.tar.gz && \
    tar -zxvf nginx-${NGINX_VERSION}.tar.gz

# Clone the ngx_http_proxy_connect_module
RUN git clone https://github.com/chobits/ngx_http_proxy_connect_module.git

# Compile Nginx with the ngx_http_proxy_connect_module
RUN cd nginx-${NGINX_VERSION} && \
    patch -p1 < /ngx_http_proxy_connect_module/patch/proxy_connect_rewrite_102101.patch && \
    ./configure --add-dynamic-module=/ngx_http_proxy_connect_module && \
    make && make install

# Use the official Nginx image to run the compiled Nginx
FROM nginx:1
# Copy the compiled Nginx binaries from the builder stage
COPY --from=builder /usr/local/nginx/modules/ngx_http_proxy_connect_module.so /usr/local/nginx/modules/ngx_http_proxy_connect_module.so

# Copy the custom Nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf
# Copy certificates for SSL.
COPY ./ssl-self-generated/ /etc/nginx/ssl/

# Expose port 8080 to the host
EXPOSE 8080

# Use the compiled Nginx as the entrypoint
ENTRYPOINT ["nginx", "-g", "daemon off;"]

# Download the Nginx source code
# RUN wget http://nginx.org/download/nginx-${NGINX_VERSION}.tar.gz && \
#     tar -zxvf nginx-${NGINX_VERSION}.tar.gz

# # Clone the ngx_http_proxy_connect_module
# RUN git clone https://github.com/chobits/ngx_http_proxy_connect_module.git

# # Compile Nginx with the ngx_http_proxy_connect_module
# RUN cd nginx-${NGINX_VERSION} && \  
# # Download the Nginx source code
# RUN wget http://nginx.org/download/nginx-${NGINX_VERSION}.tar.gz && \
#     tar -zxvf nginx-${NGINX_VERSION}.tar.gz


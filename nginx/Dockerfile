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
    ./configure --add-dynamic-module=/ngx_http_proxy_connect_module --prefix=/etc/nginx --sbin-path=/usr/sbin/nginx --modules-path=/usr/local/nginx/modules --conf-path=/etc/nginx/nginx.conf --error-log-path=/var/log/nginx/error.log --http-log-path=/var/log/nginx/access.log --pid-path=/var/run/nginx.pid --lock-path=/var/run/nginx.lock --http-client-body-temp-path=/var/cache/nginx/client_temp --http-proxy-temp-path=/var/cache/nginx/proxy_temp --http-fastcgi-temp-path=/var/cache/nginx/fastcgi_temp --http-uwsgi-temp-path=/var/cache/nginx/uwsgi_temp --http-scgi-temp-path=/var/cache/nginx/scgi_temp --with-perl_modules_path=/usr/lib/perl5/vendor_perl --user=nginx --group=nginx --with-compat --with-file-aio --with-threads --with-http_addition_module --with-http_auth_request_module --with-http_dav_module --with-http_flv_module --with-http_gunzip_module --with-http_gzip_static_module --with-http_mp4_module --with-http_random_index_module --with-http_realip_module --with-http_secure_link_module --with-http_slice_module --with-http_ssl_module --with-http_stub_status_module --with-http_sub_module --with-http_v2_module  --with-mail --with-mail_ssl_module --with-stream --with-stream_realip_module --with-stream_ssl_module --with-stream_ssl_preread_module --with-cc-opt='-Os -Wformat -Werror=format-security -g' --with-ld-opt='-Wl,--as-needed,-O1,--sort-common -Wl,-z,pack-relative-relocs' && \
    make && make install

# Use the official Nginx image to run the compiled Nginx
FROM nginx:1.25.3-bookworm
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


FROM traefik:v2.5

# Copy the Traefik configuration file into the container
COPY traefik.yml /etc/traefik/traefik.yml
COPY dynamic_conf.yml /etc/traefik/dynamic_conf.yml

# Expose ports for HTTP and HTTPS
EXPOSE 80
EXPOSE 443

# Command to run Traefik
CMD ["traefik", "--configFile=/etc/traefik/traefik.yml"]
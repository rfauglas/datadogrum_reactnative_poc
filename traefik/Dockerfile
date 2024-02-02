FROM traefik:v2.5

# Add build arguments for the configuration files
ARG CONFIG_FILE=traefik.yml

# Copy the Traefik configuration file into the container based on the build argument
COPY ${CONFIG_FILE} /etc/traefik/traefik.yml

# Expose ports for HTTP and HTTPS
EXPOSE 80
EXPOSE 443

# Command to run Traefik with the specified configuration file
CMD ["traefik", "--configFile=/etc/traefik/traefik.yml"]
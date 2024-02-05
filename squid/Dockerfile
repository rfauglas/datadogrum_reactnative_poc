# Use the official Squid image from the Docker Hub
FROM sameersbn/squid:3.3.8-23

# Define a build argument for the configuration file
ARG CONFIG=squid.conf

# Copy the Squid configuration file based on the build argument
COPY ${CONFIG} /etc/squid3/squid.conf

RUN apt-get update && apt-get install sudo

RUN echo -e "Defaults:squid !requiretty" > /etc/sudoers.d/squid
RUN echo -e "squid ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers.d/squid

# Expose the Squid port
EXPOSE 3128
# USER squid
# Run Squid
CMD ["/sbin/entrypoint.sh"]
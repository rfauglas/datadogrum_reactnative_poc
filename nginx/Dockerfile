# Use the official Squid image from the Docker Hub
FROM sameersbn/squid:3.5.27-2

# Copy the Squid configuration file
COPY squid.conf /etc/squid/squid.conf

# Expose the Squid port
EXPOSE 3128

# Run Squid
CMD ["/sbin/entrypoint.sh"]
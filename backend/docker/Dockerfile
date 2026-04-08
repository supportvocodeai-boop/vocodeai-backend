# Use official Node 20 image (multi-arch safe)
FROM node:20-bookworm

# Prevent interactive prompts
ENV DEBIAN_FRONTEND=noninteractive

# Install additional runtimes & tools
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    openjdk-17-jdk \
    gcc \
    g++ \
    git \
    curl \
    maven \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /workspace

# Verify installations (optional but useful)
RUN node -v && npm -v && java -version && mvn -v && python3 --version

# Start bash shell
CMD ["bash"]

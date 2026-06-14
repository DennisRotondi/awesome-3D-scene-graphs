# Use Node.js 22 LTS as base
FROM node:22.18

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
# RUN npm install -g npm@11.5.2
RUN npm install

# Copy the rest of the project
COPY . .

# # Build the project
# RUN npm run build

# Expose Vite preview port
EXPOSE 5173
# Start preview server
CMD ["npm", "run", "dev"]

FROM node:alpine

WORKDIR /app

COPY . .

RUN cd Frontend && \
    cd exam-app && \
    npm install

CMD cd Frontend && \
    cd exam-app && \
    npm run build

# docker build -t react .
# docker run -it -p 3000:3000 react





# for debugging purposes

# FROM node:alpine

# WORKDIR /app

# # Copy the application files into the container
# COPY . .

# # Run the ls command to list the files in the current directory
# RUN ls

# # Set the command to start an interactive shell
# CMD ["sh"]
# Use an official Python runtime as a parent image
FROM python

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY ./backend /app

# copy requirements.txt to the container
COPY ./requirements.txt .

# Install any needed packages specified in requirements.txt
# RUN apt-get update
RUN apt-get update && apt-get install ffmpeg libsm6 libxext6  -y
RUN pip install -r requirements.txt

# Expose port 8000 for the Django application
# EXPOSE 8000

# Run the command to start the Django application
# CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

COPY ./entrypoint.sh /
ENTRYPOINT [ "sh", "/entrypoint.sh" ]

# docker build -t  mahmoudaabdelkader/gpbackend .
# docker run -p 8000:8000 mahmoudaabdelkader/gpbackend
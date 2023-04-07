############################## general ##############################

####################### responses #######################

{
    "responses": [
        {  # registration response
            # http 201 created
            "email": "khalil@mail.com",
            "username": "khalil",
            "password": "pbkdf2_sha256$ ...",
            "first_name": "mahmoud",
            "last_name": "khalil"
        },
        {  # login response && refresh token response
            # http 200 ok
            "refresh": "eyJ0eXAiOiJKV1Q ...",
            "access": "eyJ0eXAiOiJKV1Q ..."
        },
        {  # course list response
            # http 200 ok
            [
                {
                    "id": 1,
                    "name": "web"
                },
                {
                    "id": 2,
                    "name": "js"
                }
            ]       
        },
        {  # course detail response

            # http 200 ok
            "id": 1,
            "name": "gpp",
            "description": "grad proj v3",
            "examiner": "watheq alkharashi",
            "status": "open",
            "is_requested": 'true',
            "is_enrolled": 'false'
            # the last two field are only sent in case
            # of a student requesting the course detail
        },
        {  # exam list response
            # http 200 ok
            [
                {
                    "id": 24,
                    "name": "Exam 1",
                    "description": "imp",
                    "exam_start_date": "2023-02-26T16:21:36",
                    "exam_end_date": "2023-02-26T16:21:37",
                    "duration": "00:00:50",
                    "max_grade": 10,
                    "course_id": 1
                },
            ]
        },
        {  # exam detail response
            # http 200 ok
            "id": 24,
            "name": "Exam 1",
            "description": "imp",
            "exam_start_date": "2023-02-26T16:21:36",
            "exam_end_date": "2023-02-26T16:21:37",
            "duration": "00:00:50",
            "max_grade": 10,
            "course_id": 1
        },
        {  # question list response
            # http 200 ok
            [
                {
                    "id": 3,
                    "question_text": "how are you?",
                    "marks": 1,
                    "choice_1": "fine1",
                    "choice_2": "fine2",
                    "choice_3": "fine3",
                    "choice_4": "fine4",
                    "correct_answer": 1,
                    "exam_id": 24
                },
                {
                    "id": 4,
                    "question_text": "how old are you?",
                    "marks": 1,
                    "choice_1": "10",
                    "choice_2": "11",
                    "choice_3": "12",
                    "choice_4": "13",
                    "correct_answer": 1,
                    "exam_id": 24
                }
            ]
        },
    ]
}

####################### expected requests #######################

{
    "requests": [
        {  # expected request format for registration
            # POST request 
            "email": "khalil@mail.com",
            "username": "khalil",
            "password": "123",
            "first_name": "mahmoud",
            "last_name": "khalil"
        },
        {   """expected request format for getting course list
            GET request
            this is example of the request
            http://localhost:8000/main_app/courselist?search=dev&all=1

            here we have four cases to consider:

            first: 
            if all = 1 (or any other value)
            and ?search= is sent in the url
            then search with filtering will take place
            in all courses in db
            using id and name fields

            second:
            if all = 1 (or any other value)
            and ?search= is not sent in the url
            then all courses in the db will be returned

            third:
            if all is not sent in the url
            and ?search= is sent in the url
            then the response will be filtered by the search value
            in courses in db for a specific user

            fourth:
            if all is not sent in the url
            and ?search= is not sent in the url
            then all courses in the db 
            for a specific user will be returned """

        },
        {  # expected request format for getting a course detail 
            # i expect course id to be sent in the url
            # GET request
        },
        {  # expected request format for getting a list of exams for a course
            # i expect course id to be sent in the url
            # GET request
        },
        {  # expected request format for getting an exam detail
            # i expect exam id to be sent in the url
            # GET request
        },
        {  # expected request format for getting an exam detail
            # i expect exam id to be sent in the url
            # GET request
        },
        {  # expected request format for getting a list of questions for an exam 

            # i expect exam id to be sent in the url
            # GET request
        },
    ]
}




############################### examiner ###############################


####################### responses #######################

{
    "responses": [
        {  # course create response
            # http 201 created
            "id": 1,
        },
        {  # course edit response
            # http 200 ok
            "name": "selected topics",
            "description": "boring courseV2",
        },
        {  # course delete response
            # http 204 no content with no body
        },
        {  # exam create response
            # http 201 created
            "id": 1,
        },
        {  # exam edit response
            # http 200 ok
        },
        {  # exam delete response
            # http 204 no content with no body
        },
        {  # question create response
            # http 201 created
            "id": 1,
        },
        {  # question edit response
            # http 200 ok
            "question_text": "what is your age?V2",
            "marks": 1,
            "choice_1": "12",
            "choice_2": "13",
            "choice_3": "14",
            "choice_4": "15",
            "correct_answer": 1
        },
        {  # question delete response
            # http 204 no content with no body
        },
        {  # enrolled student list response
            # http 200 ok
            [
                {
                    "student_name": "moath hamda",
                    "student_email": "moza@mail.com",
                    "enrollment_date": "2023-04-07T12:47:22"
                }
            ]
        },
        {  # enrollment request list response
            # http 200 ok
            [
                {
                    "id":1,
                    "course_id": 1,
                    "student_id": 1,
                    "request_date": "2023-02-27T05:36:04.727800"
                },
                {
                    "id":2,
                    "course_id": 1,
                    "student_id": 2,
                    "request_date": "2023-02-27T05:39:08.504462"
                }
            ]
        },
        {  # enrollment request action response
            # http 200 ok
            "action": "accept" or "reject"
        },
    ]
}

####################### expected requests #######################

{
    "requests": [
        {  # expected request format for creating a course
            # POST request
            "name": "selected topics",
            "description": "boring course",
            "status": "closed",
        },
        {  # expected request format for editing a course
            # i expect course id to be sent in the url
            # PUT request
            "name": "selected topics",
            "description": "boring courseV2",
            "status": "closed",
        },
        {  # expected request format for deleting a course
            # i expect course id to be sent in the url
            # DELETE request
        },
        {  # expected request format for creating an exam
            # POST request
            "course_id": "1",
            "name": "exam number 2",
            "description": "demo exam",
            "exam_start_date": "2020-05-05T12:12:01",
            "exam_end_date": "2050-05-05T12:12:12",
            "duration": "00:00:05",
        },
        {  # expected request format for editing an exam
            # i expect exam id to be sent in the url
            # PUT request
            "name": "exam number 2",
            "description": "demo exam v3",
            "exam_start_date": "2020-05-05T12:12:01",
            "exam_end_date": "2050-05-05T12:12:12",
            "duration": "00:00:05",
        },
        {  # expected request format for deleting an exam
            # i expect exam id to be sent in the url
            # DELETE request
        },
        {  # expected request format for creating a question
            # POST request
            "exam_id": "23",
            "question_text": "what is your age?",
            "marks": "1",
            "choice_1": "12",
            "choice_2": "13",
            "choice_3": "14",
            "choice_4": "15",
            "correct_answer": "1"
        },
        {  # expected request format for editing a question
            # i expect question id to be sent in the url
            # PUT request
            "question_text": "what is your age?V2",
            "marks": 1,
            "choice_1": "12",
            "choice_2": "13",
            "choice_3": "14",
            "choice_4": "15",
            "correct_answer": "1"
        },
        {  # expected request format for deleting a question
            # i expect question id to be sent in the url
            # DELETE request
        },
        {  # expected request format for getting enrolled student list for a course
            # i expect course id to be sent in the url
            # GET request
        },
        {  # expected request format for getting enrollment request list for a course
            # i expect course id to be sent in the url
            # GET request
        },
        {  # expected request format for accepting or rejecting an enrollment request
            # i expect request_id to be sent in the url
            # PUT request
            "action": "accept" or "reject"
        },
    ]
}


##################################### student #####################################


####################### expected responses #######################

{
    "responses": [
        {  # course join response
            # http 201 created
            "course_id": 1,
            "student_id": 5,
            "request_date": "2023-02-28T14:36:51.439715"
        },
        {   # Exam review response
            # http 200 ok

            "id": 1,
            "exam_id": 1,
            "student_id": 3,
            "start_time": "2023-02-28T15:40:52",
            "submission_time": "2023-02-28T15:40:54",
            "grade": 10,
            "answers": [
                {
                    "question": {
                        "id": 1,
                        "question_text": "1 +  1",
                        "marks": 10,
                        "choice_1": "1",
                        "choice_2": "2",
                        "choice_3": "3",
                        "choice_4": "4",
                        "correct_answer": 2,
                        "exam_id": 1
                    },
                    "choice": 2
                }
            ]
        },
        {   # End Exam response
            # http 200 ok            
        },
        { # photo retrieve response
            # http 200 ok
            "photo": "the image"
        }

    ]
}

####################### expected requests #######################

{
    "requests": [
        {  # expected request for join course
            # i expect course id to be sent in the url
            # POST request
        },
        {  # expected request for review exam
            # i expect exam id to be sent in the url
            # GET request
        },
        {  # expected request for end exam
            #post request
            "exam_id": 1,
            "start_time": "2023-02-28T15:40:52",
            "submission_time": "2023-02-28T15:40:54",
            "answers": [
                {
                    "question_id": 1,
                    "choice": 2
                }
            ]
        },
        {  # expected request for photo retrieve
            # GET request
        },
    ]
}

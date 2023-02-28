############################### examiner ###############################


####################### responses #######################

{
    "responses": [
        {  # registration response
            # http 201 created
            "email": "alaa@mail.com",
            "username": "alaa",
            "password": "pbkdf2_sha256$390000$Oe7XaNXiKFqHEnwde0rwdq$2AFM5UconCwbLnmV7V/2gHUHIVMnXJf1Rz8oXOA/1I4="
        },
        {  # login response && refresh token response
            # http 200 ok
            "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTE4MTIwNCwiaWF0IjoxNjc3NDA1MjA0LCJqdGkiOiI5NGM3NDhjZjZkNmM0ZDc1OTM0ZjdmZmI4YmNkNjYwZiIsInVzZXJfaWQiOjN9.RBq__QN7l2ohymWsPsd7IG9PwJq4ny0cmskzl62EjZ0",
            "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjc3NDM1MjA0LCJpYXQiOjE2Nzc0MDUyMDQsImp0aSI6IjUxMzk1MzdjM2U0MTQzZGM5NGQ4MDI1YmUxNDU3NGYzIiwidXNlcl9pZCI6M30.97tioxjPbxEHLlGHMzBabPtQYPeS-uVjkXRd02taIn4"
        },
        {  # course create response
            # http 201 created
            "name": "selected topics",
            "description": "boring course",
            "examiner_id": 2
        },
        {  # course edit response
            # http 200 ok
            "name": "selected topics",
            "description": "boring courseV2",
        },
        {  # course delete response
            # http 204 no content with no body
        },
        {  # exam edit response
            # http 200 ok
        },
        {  # exam delete response
            # http 204 no content with no body
        },
        {  # question create response
            # http 201 created
            "question_text": "what is your age?",
            "marks": 1,
            "choice_1": "12",
            "choice_2": "13",
            "choice_3": "14",
            "choice_4": "15",
            "correct_answer": 1
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
        {  # examiner course list response
            # http 200 ok
            [
                {
                    "id": 1,
                    "name": "gpp",
                    "description": "grad proj v3",
                    "examiner_id": 2
                },
                {
                    "id": 3,
                    "name": "selected topics",
                    "description": "boring courseV2",
                    "examiner_id": 2
                }
            ]
        },

        {  # course detail response -- transfer to general response

            # http 200 ok
            "id": 1,
            "name": "gpp",
            "description": "grad proj v3",
            "examiner_id": 2
        },
        {  # examiner exam list response
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
        {  # exam detail response -- transfer to general response
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
        {  # question list response -- transfer to general response
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
        {  # enrollment request list response
            # http 200 ok
            [
                {
                    "course_id": 1,
                    "student_id": 1,
                    "request_date": "2023-02-27T05:36:04.727800"
                },
                {
                    "course_id": 1,
                    "student_id": 2,
                    "request_date": "2023-02-27T05:39:08.504462"
                }
            ]
        },
        {  # enrollment request accept response
            # http 200 ok
        },
        {  # enrollment request reject response
            # http 204 no content with no body
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
        },
        {  # expected request format for editing a course
            # i expect course id to be sent in the url
            # PUT request
            "name": "selected topics",
            "description": "boring courseV2",
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
            "max_grade": "20"
        },
        {  # expected request format for editing an exam
            # i expect exam id to be sent in the url
            # PUT request
            "name": "exam number 2",
            "description": "demo exam v3",
            "exam_start_date": "2020-05-05T12:12:01",
            "exam_end_date": "2050-05-05T12:12:12",
            "duration": "00:00:05",
            "max_grade": "20"
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
        {  # expected request format for getting a list of courses for an examiner
            # GET request
        },
        {  # expected request format for getting a course detail -- transfer to general requests
            # i expect course id to be sent in the url
            # GET request
        },
        {  # expected request format for getting a list of exams for a course by an examiner
            # i expect course id to be sent in the url
            # GET request
        },

        {  # expected request format for getting an exam detail
            # i expect exam id to be sent in the url
            # GET request
        },
        {  # expected request format for getting an exam detail -- transfer to general requests
            # i expect exam id to be sent in the url
            # GET request
        },
        {  # expected request format for getting a list of questions for an exam -- transfer to general requests

            # i expect exam id to be sent in the url
            # GET request
        },
        {  # expected request format for getting enrollment request list for a course
            # i expect course id to be sent in the url
            # GET request
        },
        {  # expected request format for accepting an enrollment request
            # i expect request_id to be sent in the url
            # POST request # i think this should be editied to accept post requests
        },
        {  # expected request format for rejecting an enrollment request
            # i expect request_id to be sent in the url
            # DELETE request
        }
    ]
}


##################################### student #####################################


####################### expected responses #######################

{
    "responses": [
        {  # course list response
            # http 200 ok
            [
                {
                    "id": 1,
                    "name": "gpp",
                    "description": "grad proj v3",
                    "examiner_id": 2
                },
                {
                    "id": 3,
                    "name": "selected topics",
                    "description": "boring courseV2",
                    "examiner_id": 2
                }
            ]
        },
        {  # course search response
           # http 200 ok
            [
                {
                    "id": 4,
                    "name": "big data",
                    "description": "big data course",
                    "examiner_id": 2
                },
                {
                    "id": 5,
                    "name": "data analysis",
                    "description": "hhh",
                    "examiner_id": 2
                },
                {
                    "id": 6,
                    "name": "data science",
                    "description": "ds",
                    "examiner_id": 2
                },
                {
                    "id": 7,
                    "name": "DATABASE",
                    "description": "db",
                    "examiner_id": 2
                }
            ]
        },
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
    ]
}

####################### expected requests #######################

{
    "requests": [
        {  # expected request format for getting a list of courses for a student
            # GET request
        },
        {  # expected request for join course
            # i expect course id to be sent in the url
            # POST request
        },
    ]
}

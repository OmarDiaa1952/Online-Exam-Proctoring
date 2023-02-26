####################### responses #######################

{
    "responses": [
        { # registration response
            # http 201 created
            "email": "alaa@mail.com",
            "username": "alaa",
            "password": "pbkdf2_sha256$390000$Oe7XaNXiKFqHEnwde0rwdq$2AFM5UconCwbLnmV7V/2gHUHIVMnXJf1Rz8oXOA/1I4="
        },
        { # login response && refresh token response
            # http 200 ok
            "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTE4MTIwNCwiaWF0IjoxNjc3NDA1MjA0LCJqdGkiOiI5NGM3NDhjZjZkNmM0ZDc1OTM0ZjdmZmI4YmNkNjYwZiIsInVzZXJfaWQiOjN9.RBq__QN7l2ohymWsPsd7IG9PwJq4ny0cmskzl62EjZ0",
            "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjc3NDM1MjA0LCJpYXQiOjE2Nzc0MDUyMDQsImp0aSI6IjUxMzk1MzdjM2U0MTQzZGM5NGQ4MDI1YmUxNDU3NGYzIiwidXNlcl9pZCI6M30.97tioxjPbxEHLlGHMzBabPtQYPeS-uVjkXRd02taIn4"
        },
        { # course create response
            # http 201 created
            "name": "selected topics",
            "description": "boring course",
            "examiner_id": 2
        },
        { # course edit response
            # http 200 ok
            "name": "selected topics",
            "description": "boring courseV2",
        },
        { # course delete response
            # http 204 no content with no body
        },
        { # exam edit response
            # http 200 ok
        },
        { # exam delete response
            # http 204 no content with no body
        },
        { # question create response
            # http 201 created
            "question_text": "what is your age?",
            "marks": 1,
            "choice_1": "12",
            "choice_2": "13",
            "choice_3": "14",
            "choice_4": "15",
            "correct_answer": 1    
        },
        { # question edit response
            # http 200 ok
            "question_text": "what is your age?V2",
            "marks": 1,
            "choice_1": "12",
            "choice_2": "13",
            "choice_3": "14",
            "choice_4": "15",
            "correct_answer": 1
        },
        { # question delete response
            # http 204 no content with no body
        },
        { # examiner course list response
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
        { # examiner course detail response
            # http 200 ok
            "id": 1,
            "name": "gpp",
            "description": "grad proj v3",
            "examiner_id": 2
        },
        { # examiner exam list response
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
        { # examiner exam detail response
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
        { # examiner question list response
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
        { # expected request format for creating a course
            # POST request
            "name": "selected topics",
            "description": "boring course",
        },
        { # expected request format for editing a course
            # i expect course id to be sent in the url
            # PUT request
            "name": "selected topics",
            "description": "boring courseV2",
        },
        { # expected request format for deleting a course
            # i expect course id to be sent in the url
            # DELETE request
        },
        { # expected request format for creating an exam
            # POST request
            "course_id":"1",
            "name":"exam number 2",
            "description":"demo exam",
            "exam_start_date":"2020-05-05T12:12:01",
            "exam_end_date":"2050-05-05T12:12:12",
            "duration":"00:00:05",
            "max_grade":"20"
        },
        { # expected request format for editing an exam
            # i expect exam id to be sent in the url
            # PUT request
            "name":"exam number 2",
            "description":"demo exam v3",
            "exam_start_date":"2020-05-05T12:12:01",
            "exam_end_date":"2050-05-05T12:12:12",
            "duration":"00:00:05",
            "max_grade":"20"
        },
        { # expected request format for deleting an exam
            # i expect exam id to be sent in the url
            # DELETE request
        },
        { # expected request format for creating a question
            # POST request
            "exam_id":"23",
            "question_text": "what is your age?",
            "marks": "1",
            "choice_1": "12",
            "choice_2": "13",
            "choice_3": "14",
            "choice_4": "15",
            "correct_answer": "1"
        },
        { # expected request format for editing a question
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
        { # expected request format for deleting a question
            # i expect question id to be sent in the url
            # DELETE request
        },
        { # expected request format for getting a list of courses for an examiner
            # GET request
        },
        { # expected request format for getting a course detail for an examiner
            # i expect course id to be sent in the url
            # GET request
        },
        { # expected request format for getting a list of exams for a course by an examiner
            # i expect course id to be sent in the url
            # GET request
        },
        { # expected request format for getting an exam detail for an examiner
            # i expect exam id to be sent in the url
            # GET request
        },
        { # expected request format for getting a list of questions for an exam by an examiner
            # i expect exam id to be sent in the url
            # GET request
        },
    ]
}
## Exercise 1 - Test Cases

### Test Case 1: Conjuction not evaluated

* Less than 3 messages from the same conjunction.

* Expected result:
    - There should be no status.

---

### Test Case 2: Normal status (no warning)

* 3 or more messages from the same conjunction and the latest with
* Probability of collision < 0.0001 and Miss distance > 10000 and Time of closest approach > 14 days in the future

* Expected result:
    - status = Ok
    - warning_messages_analyzed >= 3

---

### Test Case 3: Warning status 

* 3 or more messages from the same conjunction the latest with
* 0.0001 <= Probability of collision < 0.01 and Miss distance < 10000 and Time of closest approach < 14 days in the future

* Expected result:
    - status = Warning
    - warning_messages_analyzed >= 3

---

### Test Case 4: Warning status 

* 3 or more messages from the same conjunction the latest with
* Time of closest approach < 5 days in the future and Miss distance < 5000

* Expected result:
    - status = Warning
    - warning_messages_analyzed >= 3

---

### Test Case 5: Alert status 

* 3 or more messages from the same conjunction the latest with
* Probability of Collision > 0.01

* Expected result:
    - status = Alert
    - warning_messages_analyzed >= 3

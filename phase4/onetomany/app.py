class Student:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def __repr__(self):
        return f"Student(name='{self.name}', age={self.age})"


class Classroom:
    def __init__(self, classroom_name):
        self.classroom_name = classroom_name
        self.students = []  # List to hold multiple students

    def add_student(self, student):
        self.students.append(student)

    def __repr__(self):
        return f"Classroom(classroom_name='{self.classroom_name}', students={self.students})"


# Create a Classroom object
classroom = Classroom("Math 101")

# Create Student objects
student1 = Student("Alice", 16)
student2 = Student("Bob", 17)
student3 = Student("Charlie", 15)

# Add students to the classroom
classroom.add_student(student1)
classroom.add_student(student2)
classroom.add_student(student3)

# Display the Classroom and Students
print(classroom)

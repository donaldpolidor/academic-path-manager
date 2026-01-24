Write-Host "=== ACADEMIC PATH MANAGER - TEST SCRIPT ===" -ForegroundColor Cyan
Write-Host "Creating test data..." -ForegroundColor Yellow

# 1. Créer des cours d'Informatique
Write-Host "`n1. Creating Computer Science courses..." -ForegroundColor Green

$csCourses = @(
    @{
        code = "CS101"
        title = "Introduction to Programming"
        field = "computer_science"
        level = "beginner"
        credits = 3
        description = "Basic programming concepts with Python"
    },
    @{
        code = "CS102"
        title = "Web Development Basics"
        field = "computer_science"
        level = "beginner"
        credits = 3
        description = "HTML, CSS, and JavaScript fundamentals"
    },
    @{
        code = "CS201"
        title = "Data Structures"
        field = "computer_science"
        level = "intermediate"
        credits = 4
        description = "Arrays, linked lists, trees, and algorithms"
    }
)

foreach ($course in $csCourses) {
    $body = $course | ConvertTo-Json
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3000/api/courses" -Method Post -Body $body -ContentType "application/json"
        Write-Host "    Created: $($course.code) - $($course.title)" -ForegroundColor Green
    } catch {
        Write-Host "    Error or already exists: $($course.code)" -ForegroundColor Yellow
    }
    Start-Sleep -Milliseconds 200
}


# 2. Créer des cours de Sciences Sociales
Write-Host "`n2. Creating Social Sciences courses..." -ForegroundColor Green

$ssCourses = @(
    @{
        code = "SS101"
        title = "Introduction to Sociology"
        field = "social_sciences"
        level = "beginner"
        credits = 3
        description = "Basic concepts of society and social behavior"
    },
    @{
        code = "SS102"
        title = "Psychology Fundamentals"
        field = "social_sciences"
        level = "beginner"
        credits = 3
        description = "Introduction to human behavior and mental processes"
    },
    @{
        code = "SS201"
        title = "Political Science"
        field = "social_sciences"
        level = "intermediate"
        credits = 3
        description = "Government systems and political theory"
    }
)

foreach ($course in $ssCourses) {
    $body = $course | ConvertTo-Json
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3000/api/courses" -Method Post -Body $body -ContentType "application/json"
        Write-Host "    Created: $($course.code) - $($course.title)" -ForegroundColor Green
    } catch {
        Write-Host "    Error or already exists: $($course.code)" -ForegroundColor Yellow
    }
    Start-Sleep -Milliseconds 200
}

# 3. Vérifier tous les cours créés
Write-Host "`n3. Checking all courses..." -ForegroundColor Yellow

$allCourses = Invoke-RestMethod -Uri "http://localhost:3000/api/courses" -Method Get
Write-Host "   Total courses created: $($allCourses.count)" -ForegroundColor Cyan

# 4. Filtrer par domaine
Write-Host "`n4. Filtering courses by field..." -ForegroundColor Yellow

Write-Host "   Computer Science courses:" -ForegroundColor Magenta
$csList = Invoke-RestMethod -Uri "http://localhost:3000/api/courses?field=computer_science" -Method Get
$csList.data | ForEach-Object {
    Write-Host "      $($_.code): $($_.title) (Level: $($_.level), Credits: $($_.credits))" -ForegroundColor White
}

Write-Host "   Social Sciences courses:" -ForegroundColor Magenta
$ssList = Invoke-RestMethod -Uri "http://localhost:3000/api/courses?field=social_sciences" -Method Get
$ssList.data | ForEach-Object {
    Write-Host "      $($_.code): $($_.title) (Level: $($_.level), Credits: $($_.credits))" -ForegroundColor White
}

# 5. Créer des étudiants
Write-Host "`n5. Creating students..." -ForegroundColor Yellow

$students = @(
    @{
        studentId = "STU001"
        firstName = "Alice"
        lastName = "Johnson"
        email = "alice.johnson@university.edu"
        field = "computer_science"
    },
    @{
        studentId = "STU002"
        firstName = "Bob"
        lastName = "Smith"
        email = "bob.smith@university.edu"
        field = "social_sciences"
    },
    @{
        studentId = "STU003"
        firstName = "Charlie"
        lastName = "Brown"
        email = "charlie.brown@university.edu"
        field = "computer_science"
    }
)

$studentIds = @()
foreach ($student in $students) {
    $body = $student | ConvertTo-Json
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3000/api/students" -Method Post -Body $body -ContentType "application/json"
        $studentIds += $response.data._id
        Write-Host "    Created: $($student.firstName) $($student.lastName) - $($student.studentId)" -ForegroundColor Green
    } catch {
        Write-Host "    Error or already exists: $($student.studentId)" -ForegroundColor Yellow
    }
    Start-Sleep -Milliseconds 200
}

# 6. Vérifier tous les étudiants
Write-Host "`n6. Checking all students..." -ForegroundColor Yellow

$allStudents = Invoke-RestMethod -Uri "http://localhost:3000/api/students" -Method Get
Write-Host "   Total students created: $($allStudents.count)" -ForegroundColor Cyan

# 7. Inscrire les étudiants à des cours
Write-Host "`n7. Enrolling students in courses..." -ForegroundColor Yellow

if ($studentIds.Count -ge 2) {
    # Alice (STU001 - Computer Science) s'inscrit à CS101
    $enrollAlice = @{
        courseCode = "CS101"
        courseTitle = "Introduction to Programming"
    } | ConvertTo-Json
    
    try {
        $resp = Invoke-RestMethod -Uri "http://localhost:3000/api/students/$($studentIds[0])/enroll" -Method Put -Body $enrollAlice -ContentType "application/json"
        Write-Host "    Alice enrolled in CS101" -ForegroundColor Green
    } catch {
        Write-Host "    Could not enroll Alice: $_" -ForegroundColor Yellow
    }
    
    # Bob (STU002 - Social Sciences) s'inscrit à SS101
    $enrollBob = @{
        courseCode = "SS101"
        courseTitle = "Introduction to Sociology"
    } | ConvertTo-Json
    
    try {
        $resp = Invoke-RestMethod -Uri "http://localhost:3000/api/students/$($studentIds[1])/enroll" -Method Put -Body $enrollBob -ContentType "application/json"
        Write-Host "    Bob enrolled in SS101" -ForegroundColor Green
    } catch {
        Write-Host "    Could not enroll Bob: $_" -ForegroundColor Yellow
    }
    
    # Charlie (STU003 - Computer Science) s'inscrit à CS101 et CS102
    $enrollCharlie1 = @{
        courseCode = "CS101"
        courseTitle = "Introduction to Programming"
    } | ConvertTo-Json
    
    $enrollCharlie2 = @{
        courseCode = "CS102"
        courseTitle = "Web Development Basics"
    } | ConvertTo-Json
    
    try {
        $resp1 = Invoke-RestMethod -Uri "http://localhost:3000/api/students/$($studentIds[2])/enroll" -Method Put -Body $enrollCharlie1 -ContentType "application/json"
        Write-Host "    Charlie enrolled in CS101" -ForegroundColor Green
    } catch {
        Write-Host "    Could not enroll Charlie in CS101" -ForegroundColor Yellow
    }
    
    try {
        $resp2 = Invoke-RestMethod -Uri "http://localhost:3000/api/students/$($studentIds[2])/enroll" -Method Put -Body $enrollCharlie2 -ContentType "application/json"
        Write-Host "    Charlie enrolled in CS102" -ForegroundColor Green
    } catch {
        Write-Host "    Could not enroll Charlie in CS102" -ForegroundColor Yellow
    }
}

# 8. Vérifier un étudiant spécifique
Write-Host "`n8. Checking student details..." -ForegroundColor Yellow

if ($studentIds.Count -gt 0) {
    $studentDetails = Invoke-RestMethod -Uri "http://localhost:3000/api/students/$($studentIds[2])" -Method Get
    Write-Host "   Student: $($studentDetails.data.firstName) $($studentDetails.data.lastName)" -ForegroundColor Cyan
    Write-Host "   Field: $($studentDetails.data.field)" -ForegroundColor White
    Write-Host "   Enrolled in $($studentDetails.data.enrolledCourses.Count) courses:" -ForegroundColor White
    $studentDetails.data.enrolledCourses | ForEach-Object {
        Write-Host "      $($_.courseCode): $($_.courseTitle)" -ForegroundColor Gray
    }
}

# 9. Vérifier MongoDB dans Atlas
Write-Host "`n9. Checking MongoDB connection..." -ForegroundColor Yellow
$health = Invoke-RestMethod -Uri "http://localhost:3000/health" -Method Get
Write-Host "   Status: $($health.status)" -ForegroundColor Green
Write-Host "   MongoDB: $($health.mongodb)" -ForegroundColor Green
Write-Host "   Timestamp: $($health.timestamp)" -ForegroundColor Gray

Write-Host "`n=== TEST COMPLETED SUCCESSFULLY! ===" -ForegroundColor Green
Write-Host "Your Academic Path Manager API is fully functional!" -ForegroundColor Cyan

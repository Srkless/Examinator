# Examinator

---

## How to Run

Running the application is straightforward.

### Linux

1. Make the run script executable (if needed):  
   ```bash  
   chmod +x run.sh  
   ```  
2. Execute the run script from the root folder:  
   ```bash  
   ./run.sh  
   ```  

### Windows

Simply run the batch script:  
```bat  
run.bat  
```  

---

## Generating and Viewing Documentation

### JavaDocs

Generate the JavaDocs by running the appropriate `generate_docs` script for your operating system:

- On Linux:  
  ```bash  
  ./generate_docs.sh  
  ```  
- On Windows:  
  ```bat  
  generate_docs.ps1  
  ```  

After generation, open the generated docs in your default browser by running the same script again or manually open the `target/site/apidocs/index.html` file.

### Swagger API Documentation

Start the application as described above, then open your browser and navigate to:

http://localhost:8080/swagger-ui/index.html

to explore the interactive API documentation.

---

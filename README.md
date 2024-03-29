Note: image Name and Image Key are used interchangeably

# Base URL 

The base URL for the Image API is https://tobams-task-acqa.onrender.com/

# End Points
## 1. Upload Image
Endpoints
### `POST /upload` (https://tobams-task-acqa.onrender.com/upload) 
### Description
This endpoint allows you to upload images to the server. The image key or image name is stored in the mongoDB image but the actual image is stored in AWS S3 bucket.

If you are using a form UI, the name of your form should be 'image'. If you are using postman to test the upload route the name of the Key of the form-data should also be 'image'

Note it only accepts jpeg, png and gif. 


When no image is added to the request it returns 
```javascript
	 res.status(400).json({ error: 'Please select a file' });
```
## * Success Response
When the image name is successfuly saved in the mongoDB database and the image itself is successfully uploaded to the s3 bucket, it returns the success message below
```javascript
res.json({
            success: true, 
            message: "image uploaded successfully", 
            key: result.Key,
            url: result.Location
        });
```
Note: The key from the message is the unique name of each image in which you use to get the image later
## * Error Response
```javascript
res.status(500).json({ 
            success: false, 
            message: 'Error uploading image', 
            error: error.message
        });
```

## 2. Get Image
Endpoints
### `POST /get_image` (https://tobams-task-acqa.onrender.com/get_image) 
### Description
This endpoint allows you to get and display an image from the server. The image name or key with the name "filename" is passed to the body of the request like this.

```javascript
	{
		filename: "image-key"
	}

```

"1705610112073-plural.jpg", "1705612506987-orm-sequelize.jpg" are some of the image keys already existing in the database that you can test the /get_image route with.
You can also upload your own image to get it key

The code checks if the  filename is defined, if it not, it throws the error message below

```javascript
res.status(400).json({
            success: false,
            message: "Filename not passed in the request. Check the documentation for available image names",
        });
```

if it not undefined, it moves to the next logic which is to check if the image exists in the mongoDb database, if it doesn't, it throws the error below

```javascript
res.status(404).json({
                success: false,
                message: "Image not found in the database",
            });
```

If it does exist in the database, the program returns the image buffer


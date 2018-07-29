import numpy as np
import cv2
from keras.preprocessing import image
from keras.models import model_from_json
from keras import backend as K
import os

pwd = os.path.dirname(os.path.realpath(__file__))  # Current directory


def emotion_recognition(img_path):
	# OpenCV initialization
	face_cascade = cv2.CascadeClassifier(pwd + '/elaboration_files/haarcascade_frontalface_default.xml')

	# Face expression recognizer initialization
	model = model_from_json(open(pwd + '/elaboration_files/facial_expression_model_structure.json', 'r').read())
	model.load_weights(pwd + '/elaboration_files/facial_expression_model_weights.h5')

	emotions = ('ANGRY', 'DISGUST', 'FEAR', 'HAPPY', 'SAD', 'SURPRISE', 'NEUTRAL')

	img = cv2.imread(img_path)
	gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

	faces = face_cascade.detectMultiScale(gray, 1.3, 5)

	for (x, y, w, h) in faces:
		# Crop detected face
		detected_face = img[int(y):int(y+h), int(x):int(x+w)]
		detected_face = cv2.cvtColor(detected_face, cv2.COLOR_BGR2GRAY)
		detected_face = cv2.resize(detected_face, (48, 48))

		img_pixels = image.img_to_array(detected_face)
		img_pixels = np.expand_dims(img_pixels, axis=0)

		# Pixels are in scale of [0, 255]. Normalize in scale of [0, 1]
		img_pixels /= 255
		# Store probabilities of 7 expressions
		predictions = model.predict(img_pixels)
		K.clear_session()

	# Return the most probable emotion
	return emotions[np.argmax(predictions[0])]

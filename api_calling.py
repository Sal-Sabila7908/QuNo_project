from google import genai
from dotenv import load_dotenv
import os, io
from gtts import gTTS

load_dotenv() #loading the environment variable

my_api_key=os.getenv("GEMINI_API") 

#initialize client
client=genai.Client(api_key= my_api_key)

#note generator
def note_generator(images):
 
    prompt="""Summerize the picture in note formate in 100 words and also bold the 
              important points """
    respons=client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=[images,prompt]
    )
    return respons.text

def audio_generator(text):
    speech=gTTS(text,lang='en',slow=False)
    audio_buffer=io.BytesIO()
    speech.write_to_fp(audio_buffer)
    return audio_buffer


def quiz_generator(image,difficulty):
    
    prompt=f"generate 3 quizzes based on {difficulty} and make sure markdown to differentiate the options and also add answer with explanation"
    respons=client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=[image,prompt]
    )
    return respons.text
   
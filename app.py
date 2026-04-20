import streamlit as st 
from api_calling import note_generator , audio_generator ,quiz_generator
from PIL import Image

st.title("QuNo")
st.markdown("Generate you quizzes and notes")
st.divider()

with st.sidebar:
    st.header("Contacts")
    images=st.file_uploader("Upload your photos",
              type=['jpg','jpeg','png'],
              accept_multiple_files=True)
    if images:
        if len(images)>3:
            st.error("Upload at max 3")
        else:
            st.subheader("Your uploaded images")
            col=st.columns(len(images))  
            for i in range(len(images)):  #for i,img enumerate(images):
                with col[i]:                    #with col[i]:
                    st.image (images[i])           #st.image(img)
    pil_image=[]  #
    for img in images:  #
        pil_img=Image.open(img)  #
        pil_image.append(pil_img)  #
    selected=st.selectbox("choose your criteria",
                      ("Easy","Medium","Hard"),
                      index=None)
    if selected:
        st.markdown(f"You choose {selected} level")
        
    pressed=st.button("Quizzes & Notes",type="primary")

if pressed:
    if not images:
        st.error("Upload at least 1 photo")
    if not selected:
        st.warning("You must select the catageory") 
           
    if images and selected:
       with st.container(border=True):   #notes
           st.subheader("Your notes:")
           with st.spinner("QuNo is generating your notes"):
            generated_notes=note_generator(pil_image)   
            st.markdown(generated_notes)
     
     
     
           
       with st.container(border=True):   #audio
           st.subheader("Your audio transcripts")
           with st.spinner("QuNo is generating your audio "):
            generated_notes=generated_notes.replace("#","")#generated notes pass koar agei etake 
            generated_notes=generated_notes.replace("*","")
            generated_notes=generated_notes.replace("()","")#modify kora lagbe
            generated_notes=generated_notes.replace(",","")
            audio_transcript=audio_generator(generated_notes)#eikhane pass korar age
            st.audio(audio_transcript)
       
       
       
       
       
       with st.container(border=True):   #quiz
          st.subheader(f"your {selected} level quizzes") 
          with st.spinner("QuNo is generating your quizzes"):
        
            quizzes=quiz_generator(pil_image,selected)
            st.markdown( quizzes)    
           
              
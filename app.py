from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from LLM import chatBot  
import os
from dotenv import load_dotenv

load_dotenv()
PORT = os.getenv("PORT")


app = FastAPI()

class PromptRequest(BaseModel):
    prompt: str

@app.post("/chat")
async def chat(request: PromptRequest):
    try:
        response = chatBot(request.prompt)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=PORT)

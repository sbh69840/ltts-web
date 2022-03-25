from flask import Flask, jsonify, request  
app = Flask(__name__)
def predict(context,temperature,max_length,end_sequence,return_full_text):
    return [{
        "generated_text":"sdlf kjsdl fjsad lfkjs dalfsda"
    }]
@app.route('/complete', methods=['POST'])
def generate_text():
    context = request.json['context']
    temperature = request.json['temperature']
    max_length = request.json['max_length']
    end_sequence = request.json['end_sequence']
    return_full_text = request.json['return_full_text']
    print(context)
    res = predict(context,temperature,max_length,end_sequence,return_full_text)
    return jsonify({'output': res})

if __name__ == '__main__':
    app.run(host="0.0.0.0",debug=False, port=8080)
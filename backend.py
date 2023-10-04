from flask import Flask, jsonify

@app.route('/api/data', methods=['GET'])
def get_data():
    
    return jsonify(data)
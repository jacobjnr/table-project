const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static('./main-public'));

const PORT = process.env.PORT || 3000;
const dataStore = [];

app.post('/data', (req, res) => {
    const newData = req.body;
    const existingIndex = dataStore.findIndex(item => item.id === newData.id);

    if(existingIndex >= 0){
        dataStore[existingIndex] = newData;
        res.status(201).json(newData);
    }else{
        dataStore.push(newData);
        res.status(201).json(newData);
    }
});

app.get('/data', (req, res) => {
    res.status(200).json(dataStore);
});

app.put('/data/:id', (req, res) => {
    const { id } = req.params;
    const newData = req.body;
    const existingIndex = dataStore.findIndex(item => item.id === id);

    if(existingIndex >= 0) {
        const existingEntry = dataStore[existingIndex];
        const hasChanges = existingEntry.fullName !== newData.fullName || existingEntry.phoneNumber !== newData.phoneNumber;

        if(hasChanges) {
            dataStore[existingIndex] = { ...existingEntry, ...newData};
            res.status(200).json(dataStore[existingIndex]);
        }else{
            res.status(200).json({message: "No changes detected"});
        }
    }else{
        res.status(404).json({message: "ID not found"});
    }
})

app.delete('/data/:id', (req, res) => {
    console.log('Delete request received for ID:', req.params.id);
    const { id } = req.params;
    const existingIndex = dataStore.findIndex (item => item.id === id);

    if(existingIndex >= 0){
        dataStore.splice(existingIndex, 1);
        res.status(200).json({message: 'Item deleted successfully'});
    }else{
        res.status(404).json({message:'ID not found'});
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
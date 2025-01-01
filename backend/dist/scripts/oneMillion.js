"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.duplicateDatasetToMillionEntries = duplicateDatasetToMillionEntries;
function duplicateDatasetToMillionEntries(dataset, targetCount) {
    const result = [];
    let currentIndex = 0;
    // Loop until we generate one million entries
    for (let i = 0; i < targetCount; i++) {
        // Get the current entry from the dataset, duplicating it if necessary
        const entry = Object.assign({}, dataset[currentIndex % dataset.length]); // Duplicate the current entry
        result.push(entry);
        currentIndex++;
    }
    return result;
}

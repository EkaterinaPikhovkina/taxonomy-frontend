import React, {useState, useEffect} from 'react';

function ConceptDetails({ concept }) {
    const [conceptName, setConceptName] = useState('');


    useEffect(() => {
        if (concept) {
            setConceptName(concept.title);
        } else {
            setConceptName('');
        }
    }, [concept]);

    if (!concept) {
        return <div>Виберіть концепт для відображення деталей.</div>;
    }

    return (
        <div>
            <h2>{conceptName}</h2>
        </div>
    );
}

export default ConceptDetails;
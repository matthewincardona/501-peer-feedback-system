import React from 'react';
import { Container, Typography } from '@mui/material';

const Introduction = () => {
    return (
        <Container>
            <Typography variant="body1" paragraph>
                The primary purpose of the ISTE 500-501 and iSchool Peer Feedback Tool is to enhance the efficiency and effectiveness of the peer review feedback process across various contexts, including academic courses and faculty evaluations.
            </Typography>
            <Typography variant="body1" paragraph>
                By automating and streamlining the collection and anonymization of peer feedback, this tool aims to support a more dynamic and responsive feedback environment for any courses that utilize peer feedback, benefiting not only students and faculty within the ISTE 500 and 501 courses but also faculty undergoing annual reviews.
            </Typography>
        </Container>
    );
};

export default Introduction;

import React from 'react';
import { Container, Typography } from '@mui/material';

const Styling = () => {
    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Styling Guidelines
            </Typography>
            <Typography variant="body1" paragraph>
                This project closely follows <a href="https://www.rit.edu/brandportal/website-design-and-ui" target="_blank">RIT web branding guidelines</a>. CSS generally follows these conventions to avoid naming conflicts:
            </Typography>
            <Typography variant="h6" gutterBottom style={{ marginTop: '30px' }}>
                CSS Class Naming Format
            </Typography>
            <Typography variant="body1" paragraph>
                Start all CSS classes with your component name in camel case. Use the following format:
            </Typography>
            <Typography variant="body1" paragraph>
                <strong>Format:</strong> {`{componentName}__{element}-{element}--{modifier}`}
            </Typography>
            <Typography variant="h6" gutterBottom>
                Example
            </Typography>
            <Typography variant="body1" paragraph>
                If you are creating a component called `FormCard`, the CSS classes would be named as follows:
            </Typography>
            <Typography variant="body1" paragraph style={{ fontStyle: 'italic' }}>
                .formCard {"{"}<br />
                &nbsp;&nbsp;background: blue;<br />
                {"}"}
            </Typography>
            <Typography variant="body1" paragraph>
                To style an element called “toolbar”:
            </Typography>
            <Typography variant="body1" paragraph style={{ fontStyle: 'italic' }}>
                .formCard__toolbar {"{"}<br />
                &nbsp;&nbsp;background: blue;<br />
                {"}"}
            </Typography>
            <Typography variant="body1" paragraph>
                For an element with two words in its name, such as “toolbar button”:
            </Typography>
            <Typography variant="body1" paragraph style={{ fontStyle: 'italic' }}>
                .formCard__toolbar-button {"{"}<br />
                &nbsp;&nbsp;background: blue;<br />
                {"}"}
            </Typography>
            <Typography variant="body1" paragraph>
                For element modifiers, such as “disabled” or specific colors:
            </Typography>
            <Typography variant="body1" paragraph style={{ fontStyle: 'italic' }}>
                .formCard__toolbar-button--inactive {"{"}<br />
                &nbsp;&nbsp;background: blue;<br />
                {"}"}
            </Typography>
            <Typography variant="body1" paragraph style={{ fontStyle: 'italic' }}>
                .formCard__toolbar-button--red {"{"}<br />
                &nbsp;&nbsp;background: blue;<br />
                {"}"}
            </Typography>
        </Container>
    );
};

export default Styling;

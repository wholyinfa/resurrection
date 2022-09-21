import React from 'react';
import PropTypes, {InferProps} from 'prop-types';

export default function NotFound({paginating}: InferProps<typeof NotFound.propTypes>) {
    return <h1>NOT FOUND:(</h1>;
}
NotFound.propTypes ={
    paginating: PropTypes.func.isRequired
}
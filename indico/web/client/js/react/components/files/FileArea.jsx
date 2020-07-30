// This file is part of Indico.
// Copyright (C) 2002 - 2020 CERN
//
// Indico is free software; you can redistribute it and/or
// modify it under the terms of the MIT License; see the
// LICENSE file for more details.

import React from 'react';
import PropTypes from 'prop-types';
import {Button, Card, Divider, Grid, Header, Segment, Icon} from 'semantic-ui-react';
import {TooltipIfTruncated} from 'indico/react/components';
import {Translate, Param} from 'indico/react/i18n';
import {fileDetailsShape} from './props';

import './FileArea.module.scss';

function humanReadableBytes(bytes) {
  const kiloBytes = 1000;
  const megaBytes = 1000 * kiloBytes;

  if (bytes < kiloBytes) {
    return (
      <Translate>
        <Param name="size" value={bytes} /> bytes
      </Translate>
    );
  } else if (bytes < megaBytes) {
    return (
      <Translate>
        <Param name="size" value={(bytes / kiloBytes).toFixed(2)} /> kB
      </Translate>
    );
  } else {
    return (
      <Translate>
        <Param name="size" value={(bytes / megaBytes).toFixed(2)} /> MB
      </Translate>
    );
  }
}

const dropzoneShape = PropTypes.shape({
  getRootProps: PropTypes.func.isRequired,
  getInputProps: PropTypes.func.isRequired,
  isDragActive: PropTypes.bool.isRequired,
  open: PropTypes.func.isRequired,
});

const fileActionShape = PropTypes.shape({
  icon: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
});

export function FileArea({
  dropzone: {getRootProps, getInputProps, isDragActive, open: openFileDialog},
  files,
  disabled,
  dragText,
  fileAction,
}) {
  return (
    <div {...getRootProps()} styleName="dropzone-area">
      <input {...getInputProps()} />
      <Segment textAlign="center" placeholder>
        <Grid celled="internally">
          <Grid.Row columns={files.length === 0 ? 1 : 2}>
            {!isDragActive && files.length !== 0 && (
              <Grid.Column width={10} verticalAlign="middle">
                <Card.Group itemsPerRow={files.length === 1 ? 1 : 2} centered>
                  {files.map(file => (
                    <Card
                      styleName="file-card"
                      key={file.filename}
                      centered={files.length === 1}
                      raised
                    >
                      <Card.Content>
                        <Card.Header textAlign="center">
                          <TooltipIfTruncated>
                            <div style={{textOverflow: 'ellipsis', overflow: 'hidden'}}>
                              {file.filename}
                            </div>
                          </TooltipIfTruncated>
                        </Card.Header>
                        <Card.Meta textAlign="center">{humanReadableBytes(file.size)}</Card.Meta>
                      </Card.Content>
                      {!disabled && fileAction && (
                        <Icon
                          name={fileAction.icon}
                          color={fileAction.color}
                          style={{cursor: 'pointer'}}
                          onClick={() => fileAction.onClick(file)}
                        />
                      )}
                    </Card>
                  ))}
                </Card.Group>
              </Grid.Column>
            )}
            <Grid.Column verticalAlign="middle" width={files.length === 0 || isDragActive ? 16 : 6}>
              <Header>{dragText}</Header>
              {!isDragActive && (
                <>
                  <Divider horizontal>
                    <Translate>Or</Translate>
                  </Divider>
                  <Button
                    type="button"
                    styleName="file-selection-btn"
                    icon="upload"
                    content={Translate.string('Choose from your computer')}
                    onClick={() => openFileDialog()}
                    disabled={disabled}
                  />
                </>
              )}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </div>
  );
}

FileArea.propTypes = {
  dropzone: dropzoneShape.isRequired,
  files: PropTypes.arrayOf(fileDetailsShape).isRequired,
  disabled: PropTypes.bool.isRequired,
  dragText: PropTypes.string,
  fileAction: fileActionShape,
};
FileArea.defaultProps = {
  dragText: Translate.string('Drag file(s) here'),
  fileAction: null,
};

export function SingleFileArea({file, ...rest}) {
  const files = file ? [file] : [];
  return <FileArea files={files} dragText={Translate.string('Drag file here')} {...rest} />;
}

SingleFileArea.propTypes = {
  dropzone: dropzoneShape.isRequired,
  file: fileDetailsShape,
  disabled: PropTypes.bool.isRequired,
  fileAction: fileActionShape,
};

SingleFileArea.defaultProps = {
  file: null,
  fileAction: null,
};
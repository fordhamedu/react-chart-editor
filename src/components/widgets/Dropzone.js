import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Drop from 'react-dropzone';
import {localize} from 'lib';

class Dropzone extends Component {
  constructor(props) {
    super(props);
    const _ = props.localize;

    this.state = {
      content: '',
    };

    this.validFiletypes = {
      image: _(
        'image/jpeg, image/jpg, image/svg, image/png, image/gif, image/bmp, image/webp'
      ),
    };

    this.onDrop = this.onDrop.bind(this);
    this.renderSuccess = this.renderSuccess.bind(this);
  }

  renderSuccess(value) {
    const _ = this.props.localize;

    if (this.props.fileType === 'image') {
      return (
        <div
          className="dropzone-container__image"
          style={{backgroundImage: `url(${value})`}}
        />
      );
    }

    return (
      <div className="dropzone-container__message">{_('File loaded!')}</div>
    );
  }

  componentWillMount() {
    const _ = this.props.localize;

    if (this.props.value && this.props.value !== '') {
      this.setState({content: this.renderSuccess(this.props.value)});
      return;
    }

    this.setState({
      content: (
        <div className="dropzone-container__message">
          <p>
            {_('Drop the ') +
              this.props.fileType +
              _(
                ' to upload here or click to choose a file from your computer.'
              )}
          </p>

          {this.props.fileType === 'image' ? (
            <p>
              {_('Supported formats are: ') +
                this.validFiletypes[this.props.fileType]
                  .split('image/')
                  .join('') +
                '.'}
            </p>
          ) : null}
        </div>
      ),
    });
  }

  onLoad(e) {
    const _ = this.props.localize;
    const supportedFileTypes =
      this.props.fileType === 'image'
        ? this.validFiletypes[this.props.fileType].split('image/').join('')
        : this.validFiletypes[this.props.fileType];

    const parsingError = (
      <div className="dropzone-container__message">
        <p>{_('Yikes! An error occurred while parsing this file.')}</p>
        <p>
          {_('Try again with a supported file format: ') +
            supportedFileTypes +
            '.'}
        </p>
      </div>
    );

    if (this.props.fileType === 'image') {
      try {
        this.props.onUpdate(e.target.result);
        this.setState({
          content: this.renderSuccess(e.target.result),
        });
      } catch (error) {
        console.warn(error); // eslint-disable-line
        this.setState({
          content: parsingError,
        });
      }
    }
  }

  onDrop(accepted, rejected) {
    const _ = this.props.localize;
    const reader = new FileReader();

    if (accepted.length) {
      if (accepted.length > 1) {
        this.setState({
          content: (
            <div className="dropzone-container__message">
              <p>{_('Yikes! You can only upload one file at a time.')}</p>
              <p>
                {_(
                  'To upload multiple files, create multiple files and upload them individually.'
                )}
              </p>
            </div>
          ),
        });
        return;
      }
      this.setState({content: _('Loading...')});
      reader.onload = e => this.onLoad(e);
      if (this.props.fileType === 'image') {
        reader.readAsDataURL(accepted[0]);
      }
    }

    if (rejected.length) {
      const supportedFileTypes =
        this.props.fileType === 'image'
          ? this.validFiletypes[this.props.fileType].split('image/').join('')
          : this.validFiletypes[this.props.fileType];

      this.setState({
        content: (
          <div className="dropzone-container__message">
            <p>
              {_("Yikes! This doesn't look like a valid ") +
                this.props.fileType +
                _(' to us. ')}
            </p>
            <p>{_('Try again with a ') + supportedFileTypes + ' file.'}</p>
          </div>
        ),
      });
    }
  }

  render() {
    return (
      <Drop
        accept={this.validFiletypes[this.props.fileType]}
        onDrop={this.onDrop}
        className="dropzone-container"
        activeClassName="dropzone-container--active"
        rejectClassName="dropzone-container--rejected"
      >
        <div className="dropzone-container__content">{this.state.content}</div>
      </Drop>
    );
  }
}

Dropzone.propTypes = {
  localize: PropTypes.func,
  fileType: PropTypes.string.isRequired,
  onUpdate: PropTypes.func,
  value: PropTypes.any,
};

export default localize(Dropzone);

import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import user from '@testing-library/user-event'

import App from './App';
import { act } from 'react-dom/test-utils';
class FileReaderMock {
  onloadend = jest.fn();
  readAsText = jest.fn();
  result =`/help_page/1 126.318.035.038
/about/2 444.701.448.104
/help_page/1 929.398.951.889
/help_page/1 722.247.931.582
/about 061.945.150.735
/help_page/1 722.247.931.582`;
}

describe('Form', () => {
  let fileTypeReader;
  let file;
  beforeEach(() => {
    file = new File([new ArrayBuffer(1)], 'webserver.log', { type: '' })
    fileTypeReader = new FileReaderMock();
    jest.spyOn(window, 'FileReader').mockImplementation(() => fileTypeReader);
  })

  test('render App', () => {
    render(<App />);
    const linkElement = screen.getByText(/Please upload webserver.log/i);
    expect(linkElement).toBeInTheDocument();
    expect(
      screen.getByTestId('form')
    ).toBeInTheDocument();
    expect(screen.getByTestId('submit')).toBeDisabled()
  });

  test('upload the file', async () => {
    render(<App />);
    const input = screen.getByTestId('fileInput')
    user.upload(input, file)
    await waitFor(() => {
      expect(input.files[0]).toStrictEqual(file)
      expect(input.files).toHaveLength(1)
    })
    expect(screen.getByTestId('submit')).toBeEnabled()
  });

  test('submit the form', () => {
    const { getByTestId } = render(<App />);
    user.upload(getByTestId('fileInput'), file)
    fireEvent.submit(getByTestId('form'));
    expect(fileTypeReader.onloadend).toBeDefined();
    expect(fileTypeReader.readAsText).toBeCalled();
    expect(screen.getByTestId('submit')).toBeDisabled()
  });

  test('render page-views', () => {
    const { getByTestId } = render(<App />);
    user.upload(getByTestId('fileInput'), file)
    fireEvent.submit(getByTestId('form'));
    act(() => fileTypeReader.onloadend())
    expect(getByTestId('page-views').children.length).toEqual(3);
  });

  test('render unique page views list', () => {
    const { getByTestId } = render(<App />);
    user.upload(getByTestId('fileInput'), file)
    fireEvent.submit(getByTestId('form'));
    act(() => fileTypeReader.onloadend())
    expect(getByTestId('unique-page-views').children.length).toEqual(3);
  });

  test('render correct first node for page views', () => {
    const { getByTestId } = render(<App />);
    user.upload(getByTestId('fileInput'), file)
    fireEvent.submit(getByTestId('form'));
    act(() => fileTypeReader.onloadend())
    expect(getByTestId('page-views').children[0].textContent).toEqual('/help_page/1 4 visits');
  });

  test('render correct first node for unique page views', () => {
    const { getByTestId } = render(<App />);
    user.upload(getByTestId('fileInput'), file)
    fireEvent.submit(getByTestId('form'));
    act(() => fileTypeReader.onloadend())
    expect(getByTestId('unique-page-views').children[0].textContent).toEqual('/help_page/1 3 unique views');
  });
  
  afterEach(cleanup)
});
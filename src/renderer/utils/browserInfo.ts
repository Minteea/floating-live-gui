export default function getBrowserInfo(browserUserAgentString: string) {
  if (browserUserAgentString != null) {
    browserUserAgentString = browserUserAgentString.trim();

    const lowerStr = browserUserAgentString.toLowerCase();

    if (lowerStr != '') {
      let startIdx = browserUserAgentString.indexOf('(');
      let endIdx = browserUserAgentString.indexOf(')', startIdx + 1);

      let name = '';

      let version = '';

      const deviceOS = browserUserAgentString.substring(startIdx + 1, endIdx);

      // web browser on mobile device.
      if (lowerStr.indexOf('mobile') > 0) {
        const KEYWORD_OPR = 'opt/';
        const KEYWORD_CHROME = 'crios/';
        const KEYWORD_FIREFOX = 'fxios/';
        const KEYWORD_EDG = 'edgios/';
        const KEYWORD_SAFARI = 'version/';

        if (lowerStr.indexOf(KEYWORD_OPR) > -1) {
          startIdx = lowerStr.indexOf(KEYWORD_OPR);

          name = 'Opera';

          version = browserUserAgentString.substring(
            startIdx + KEYWORD_OPR.length
          );
        } else if (lowerStr.indexOf(KEYWORD_CHROME) > -1) {
          startIdx = lowerStr.indexOf(KEYWORD_CHROME);

          endIdx = lowerStr.indexOf(' ', startIdx + KEYWORD_CHROME.length);

          name = 'Chrome';

          version = browserUserAgentString.substring(
            startIdx + KEYWORD_CHROME.length,
            endIdx
          );
        } else if (lowerStr.indexOf(KEYWORD_FIREFOX) > -1) {
          startIdx = lowerStr.indexOf(KEYWORD_FIREFOX);

          endIdx = lowerStr.indexOf(' ', startIdx + 1);

          name = 'Firefox';

          version = browserUserAgentString.substring(
            startIdx + KEYWORD_FIREFOX.length,
            endIdx
          );
        } else if (lowerStr.indexOf(KEYWORD_EDG) > -1) {
          startIdx = lowerStr.indexOf(KEYWORD_EDG);

          endIdx = lowerStr.indexOf(' ', startIdx + 1);

          name = 'Microsoft Edge';

          version = browserUserAgentString.substring(
            startIdx + KEYWORD_EDG.length,
            endIdx
          );
        } else {
          name = 'Safari';

          startIdx = lowerStr.indexOf(KEYWORD_SAFARI);

          endIdx = lowerStr.indexOf(' ', startIdx + 1);

          version = browserUserAgentString.substring(
            startIdx + KEYWORD_SAFARI.length,
            endIdx
          );
        }
      }
      // web browser on desktop or laptop OS.
      else {
        const KEYWORD_OPR = 'opr/';
        const KEYWORD_CHROME = 'chrome/';
        const KEYWORD_FIREFOX = 'firefox/';
        const KEYWORD_EDG = 'edg/';
        const KEYWORD_SAFARI = 'version/';

        if (lowerStr.indexOf(KEYWORD_OPR) > -1) {
          startIdx = lowerStr.indexOf(KEYWORD_OPR);

          name = 'Opera';

          version = browserUserAgentString.substring(
            startIdx + KEYWORD_OPR.length
          );
        } else if (lowerStr.indexOf(KEYWORD_EDG) > -1) {
          startIdx = lowerStr.indexOf(KEYWORD_EDG);

          name = 'Microsoft Edge';

          version = browserUserAgentString.substring(
            startIdx + KEYWORD_EDG.length
          );
        } else if (lowerStr.indexOf(KEYWORD_FIREFOX) > -1) {
          startIdx = lowerStr.indexOf(KEYWORD_FIREFOX);

          name = 'Firefox';

          version = browserUserAgentString.substring(
            startIdx + KEYWORD_FIREFOX.length
          );
        } else if (lowerStr.indexOf(KEYWORD_CHROME) > -1) {
          startIdx = lowerStr.indexOf(KEYWORD_CHROME);

          endIdx = lowerStr.indexOf(' ', startIdx + 1);

          name = 'Chrome';

          version = browserUserAgentString.substring(
            startIdx + KEYWORD_CHROME.length,
            endIdx
          );
        } else {
          name = 'Safari';

          startIdx = lowerStr.indexOf(KEYWORD_SAFARI);

          endIdx = lowerStr.indexOf(' ', startIdx + 1);

          version = browserUserAgentString.substring(
            startIdx + KEYWORD_SAFARI.length,
            endIdx
          );
        }
      }

      return {
        name,
        version,
        deviceOS,
      };
    }
  }
}

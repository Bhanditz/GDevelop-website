const chalk = require('chalk');
const { createFilePath } = require('gatsby-source-filesystem');
const { getAllLocales } = require('./i18n-helpers');

const supportedLocales = ['en', 'es', 'fr', 'ja', 'ms', 'pl', 'pt', 'tr', 'zh'];
const locales = [
  {
    name: 'English',
    path: '',
    langCode: 'en',
    longLangCode: 'en-US',
    messages: {},
    translationRatio: 1,
  },
  ...getAllLocales(),
].filter(locale => {
  if (
    locale.translationRatio < 0.7 &&
    !supportedLocales.includes(locale.langCode)
  ) {
    return false;
  }

  return true;
});

console.log(
  chalk.blue(
    `${locales.length} locales loaded:`,
    locales.map(locale => locale.langCode)
  )
);

exports.onCreatePage = ({ page, boundActionCreators }) => {
  const { createPage, deletePage } = boundActionCreators;

  if (page.path.includes('choose-language')) {
    return new Promise(resolve => {
      deletePage(page);
      createPage(makeChooseLanguagePage(page));

      resolve();
    });
  } else {
    return new Promise(resolve => {
      const pages = makeLocalizedPages(page);
      deletePage(page);
      pages.map(page => createPage(page));

      resolve();
    });
  }
};

const makeLocalizedPages = page => {
  const pages = [];
  locales.map(locale => {
    const langPathPrefix = locale.path;
    const path = langPathPrefix + page.path;

    pages.push({
      ...page,
      path,
      context: {
        localeCode: locale.langCode,
        stringifiedLocaleMessages: JSON.stringify({
          [locale.langCode]: {
            translation: {
              ...locale.messages,
              LANG_PATH_PREFIX: langPathPrefix ? '/' + langPathPrefix : '',
              LANG_CODE: locale.langCode,
            },
          },
        }),
      },
    });
  });

  return pages;
};

const makeChooseLanguagePage = page => {
  return {
    ...page,
    context: {
      localeCode: 'en',
      stringifiedLocaleMessages: JSON.stringify({
        en: {
          translation: {
            LANG_PATH_PREFIX: '',
            LANG_CODE: 'en',
          },
        },
      }),
      localeNamesAndPaths: locales.map(locale => ({
        name: locale.name,
        path: locale.path,
      })),
    },
  };
};

exports.onCreateNode = ({ node, boundActionCreators, getNode }) => {
  const { createNodeField } = boundActionCreators;

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode });
    createNodeField({
      name: `slug`,
      node,
      value,
    });
  }
};

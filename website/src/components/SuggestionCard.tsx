import { useState } from 'react';
import React from 'react';
import { Card, Col, Toast, ToastContainer } from 'react-bootstrap';
import { FaCopy, FaRegBookmark, FaBookmark } from 'react-icons/fa';
import { getPaperLinks } from './paperLinks';
import { TOAST_DURATION_MS, formatDate } from './Constants';
import type { Paper } from './papers';
import { isBookmarked, toggleBookmark } from '../utils/bookmarks';

type DetailLevel = 'mini' | 'small' | 'detail';

function SuggestionCard({
  sugg,
  detailLevel,
  onKeywordClick,
}: {
  sugg: Paper;
  detailLevel: DetailLevel;
  onKeywordClick?: (term: string) => void;
}) {
  const [showToast, setShowToast] = useState(false);
  const [bookmarked, setBookmarked] = useState(() => isBookmarked(sugg['ID']));

  const links = getPaperLinks(sugg);
  const keywords = (sugg['KEYWORD'] || '')
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean);

  const handleBookmark = () => setBookmarked(toggleBookmark(sugg['ID']));

  const showKeyword = detailLevel === 'small' || detailLevel === 'detail';
  const showAbstract = detailLevel === 'detail';

  const bibtex = sugg['BIBTEX'] || 'No BibTeX available';

  const handleCopy = () => {
    navigator.clipboard.writeText(bibtex);
    setShowToast(true);
    setTimeout(() => setShowToast(false), TOAST_DURATION_MS);
  };

  return (
    <Col key={sugg['ID']} xs={12} sm={6} lg={4} className="mb-4">
      <Card className={`d-flex flex-column position-relative ${showAbstract ? 'h-100' : ''}`}>
        {/* Toast notification */}
        <ToastContainer className="p-3" position="middle-center" style={{ zIndex: 1 }}>
          <Toast
            onClose={() => setShowToast(false)}
            show={showToast}
            delay={TOAST_DURATION_MS}
            autohide
          >
            <Toast.Header>
              <strong className="me-auto text-font-base">Clipboard</strong>
            </Toast.Header>
            <Toast.Body className="text-font-small">BibTeX copied to clipboard!</Toast.Body>
          </Toast>
        </ToastContainer>

        {/* Bookmark icon: left of the copy icon, fills green when saved */}
        {bookmarked ? (
          <FaBookmark
            aria-label="Remove bookmark"
            title="Remove bookmark"
            className="card-bookmark-icon bookmarked"
            onClick={handleBookmark}
          />
        ) : (
          <FaRegBookmark
            aria-label="Bookmark this paper"
            title="Bookmark this paper"
            className="card-bookmark-icon"
            onClick={handleBookmark}
          />
        )}

        {/* Copy icon pinned to extreme top-right border */}
        <FaCopy
          aria-label="Copy BibTeX"
          title="Copy BibTeX"
          className="card-copy-icon"
          onClick={handleCopy}
        />

        <Card.Body className="d-flex flex-column align-items-center text-center">
          {/* Title */}
          <Card.Title
            className="mb-2"
            style={{ cursor: 'pointer' }}
            onClick={() => window.open(`/${sugg['ID']}`, '_blank')}
          >
            {sugg['TITLE']}
          </Card.Title>

          {/* Links - right after title */}
          <div className="mb-3 d-flex justify-content-center w-100 px-5 gap-5">
            {links.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                title={link.label}
                className="text-decoration-none card-link-icon"
              >
                {link.icon}
              </a>
            ))}
          </div>

          {/* Author */}
          {sugg['AUTHOR'] && (
            <Card.Subtitle className="mb-2 text-muted authors">{sugg['AUTHOR']}</Card.Subtitle>
          )}

          {/* Venue */}
          {sugg['VENUE'] && (
            <Card.Subtitle className="mb-2 text-muted other" style={{ fontSize: '0.9rem' }}>
              Venue: {sugg['VENUE']}
            </Card.Subtitle>
          )}

          {/* Date */}
          {sugg['DATE'] && (
            <Card.Subtitle className="mb-0 text-muted other" style={{ fontSize: '0.9rem' }}>
              Date: {formatDate(sugg['DATE'])}
            </Card.Subtitle>
          )}

          {/* Keywords as clickable filter chips */}
          {showKeyword && keywords.length > 0 && (
            <div className="keyword-chips w-100 mb-1">
              {keywords.map((term) => (
                <button
                  key={term}
                  type="button"
                  className="keyword-chip"
                  title={`Filter by "${term}"`}
                  onClick={() => onKeywordClick?.(term)}
                >
                  {term}
                </button>
              ))}
            </div>
          )}

          {/* Abstract grows to fill remaining space */}
          {showAbstract && sugg['ABSTRACT'] && (
            <div
              style={{
                flexGrow: 1,
                overflowY: 'auto',
                borderTop: '0.1rem solid #ddd',
                width: '100%',
                textAlign: 'left',
                height: '150px',
              }}
            >
              <Card.Text className="mt-2 abstract">{sugg['ABSTRACT']}</Card.Text>
            </div>
          )}
        </Card.Body>
      </Card>
    </Col>
  );
}

export default SuggestionCard;

import { 
  Box, 
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

/**
 * Server component for rendering track FAQs
 * This is extracted from the client component to improve SEO
 */
export default function TrackFAQs({ faqs }) {
  // Don't render if no FAQs
  if (!faqs || faqs.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 8 }}>
      <Typography
        variant="h2"
        sx={{
          fontWeight: 800,
          mb: 6,
          textAlign: 'center',
          fontSize: { xs: '1.75rem', md: '2.25rem' },
          color: 'text.primary'
        }}
      >
        Frequently Asked Questions
      </Typography>

      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        {faqs.map((faq, index) => (
          <Accordion
            key={index}
            sx={{
              mb: 2,
              border: '1px solid #e0e0e0',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              borderRadius: '12px !important',
              '&:before': { display: 'none' }
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: '#EE1E50' }} />}
              sx={{
                py: 2,
                px: 3
              }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                {faq.question || `Question ${index + 1}`}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 3, py: 3 }}>
              <Typography sx={{ lineHeight: 1.7, fontSize: '1rem' }}>
                {faq.answer || 'No answer available.'}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  );
}

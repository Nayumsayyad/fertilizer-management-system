import * as React from 'react';
import axios from 'axios';
import {
  Container, Typography, Grid, Button, Paper, Box, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert,
  Stepper, Step, StepLabel, Radio, RadioGroup, FormControlLabel, FormControl,
  Divider, CircularProgress, Chip
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { API_URL } from '../../config';

const steps = ['Confirm Order', 'Select Payment', 'Enter Card Details', 'Processing'];

const ItemView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [quantity, setQuantity] = React.useState(1);
  const [activeStep, setActiveStep] = React.useState(-1);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState('');
  const [paymentInfo, setPaymentInfo] = React.useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });
  const [cardErrors, setCardErrors] = React.useState({});
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = React.useState(false);
  const [orderSuccess, setOrderSuccess] = React.useState(false);
  const [orderId, setOrderId] = React.useState('');
  const [processing, setProcessing] = React.useState(false);

  React.useEffect(() => {
    axios.get(`${API_URL}/item/get/${id}`)
      .then((res) => {
        const { status, item } = res.data;
        if (status === "Item Fetched") {
          setItem(item);
          setLoading(false);
        } else {
          setLoading(false);
          setError("Error fetching item");
        }
      })
      .catch(() => {
        setLoading(false);
        setError("Error fetching item");
      });
  }, [id]);

  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value);
    setQuantity(value >= 1 ? value : 1);
  };

  const getTotalPrice = () => item ? item.price * quantity : 0;

  const handleBuyNow = () => {
    const farmerId = localStorage.getItem('logId');
    if (!farmerId) {
      setError("Please login as a farmer to place an order");
      return;
    }
    setActiveStep(0);
  };

  const handleNext = () => {
    if (activeStep === 1 && !selectedPaymentMethod) return;
    if (activeStep === 2) {
      const errors = validatePaymentInfo();
      if (Object.keys(errors).length > 0) {
        setCardErrors(errors);
        return;
      }
      setCardErrors({});
      placeOrder();
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleClose = () => {
    setActiveStep(-1);
    setSelectedPaymentMethod('');
    setPaymentInfo({ cardNumber: '', cardHolder: '', expiryDate: '', cvv: '' });
    setCardErrors({});
    setProcessing(false);
  };

  const validatePaymentInfo = () => {
    const errors = {};
    if (!/^[0-9]{16}$/.test(paymentInfo.cardNumber.replace(/\s/g, ''))) {
      errors.cardNumber = 'Enter a valid 16-digit card number';
    }
    if (!paymentInfo.cardHolder.trim()) {
      errors.cardHolder = 'Cardholder name is required';
    }
    if (!/^(0[1-9]|1[0-2])\/([0-9]{2}|[0-9]{4})$/.test(paymentInfo.expiryDate)) {
      errors.expiryDate = 'Use MM/YY or MM/YYYY format';
    }
    if (!/^[0-9]{3,4}$/.test(paymentInfo.cvv)) {
      errors.cvv = 'Enter a valid CVV (3 or 4 digits)';
    }
    return errors;
  };

  const placeOrder = () => {
    setProcessing(true);
    setActiveStep(3);

    const farmerId = localStorage.getItem('logId');
    const orderDetails = {
      name: item.name,
      itemcode: item.itemcode,
      quantity: quantity,
      price: getTotalPrice(),
      farmerId: farmerId,
      paymentMethod: selectedPaymentMethod,
      cardLast4: paymentInfo.cardNumber.slice(-4),
      paymentStatus: 'Paid'
    };

    setTimeout(() => {
      axios.post(`${API_URL}/order/add`, orderDetails)
        .then((response) => {
          setProcessing(false);
          setOrderId(response.data.orderId || '');
          setOrderSuccess(true);
          setActiveStep(-1);
          setOpenSuccessSnackbar(true);
        })
        .catch((error) => {
          setProcessing(false);
          setError('Error placing order. Please try again.');
          setActiveStep(-1);
          console.error("Error placing order:", error);
        });
    }, 2000);
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : v;
  };

  const handleCardNumberChange = (event) => {
    const formatted = formatCardNumber(event.target.value);
    setPaymentInfo((prev) => ({ ...prev, cardNumber: formatted }));
    setCardErrors((prev) => ({ ...prev, cardNumber: '' }));
  };

  const handleExpiryDateChange = (event) => {
    let val = event.target.value.replace(/[^0-9/]/g, '');
    if (val.length === 2 && !val.includes('/') && event.nativeEvent.inputType !== 'deleteContentBackward') {
      val = val + '/';
    }
    if (val.length === 5 && val.charAt(2) === '/' && val.charAt(4) !== '/' && event.nativeEvent.inputType !== 'deleteContentBackward') {
      val = val + '20';
    }
    setPaymentInfo((prev) => ({ ...prev, expiryDate: val }));
    setCardErrors((prev) => ({ ...prev, expiryDate: '' }));
  };

  const handleCVVChange = (event) => {
    const cvv = event.target.value.replace(/\D/g, '').substring(0, 4);
    setPaymentInfo((prev) => ({ ...prev, cvv: cvv }));
    setCardErrors((prev) => ({ ...prev, cvv: '' }));
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Order Summary</Typography>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={6}><Typography>Item:</Typography></Grid>
              <Grid item xs={6}><Typography fontWeight="bold">{item?.name}</Typography></Grid>
              <Grid item xs={6}><Typography>Item Code:</Typography></Grid>
              <Grid item xs={6}><Typography>{item?.itemcode}</Typography></Grid>
              <Grid item xs={6}><Typography>Unit Price:</Typography></Grid>
              <Grid item xs={6}><Typography>Rs. {item?.price}</Typography></Grid>
              <Grid item xs={6}><Typography>Quantity:</Typography></Grid>
              <Grid item xs={6}><Typography>{quantity}</Typography></Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h5" color="primary" fontWeight="bold">
              Total: Rs. {getTotalPrice()}
            </Typography>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Select Payment Method</Typography>
            <Divider sx={{ my: 2 }} />
            <FormControl component="fieldset" fullWidth>
              <RadioGroup value={selectedPaymentMethod} onChange={(e) => setSelectedPaymentMethod(e.target.value)}>
                <FormControlLabel
                  value="Visa"
                  control={<Radio />}
                  label={
                    <Box display="flex" alignItems="center" gap={1}>
                      <CreditCardIcon sx={{ color: '#1a1f71' }} />
                      <Typography>Visa Card</Typography>
                    </Box>
                  }
                  sx={{ border: 1, borderColor: selectedPaymentMethod === 'Visa' ? 'primary.main' : 'grey.300', borderRadius: 1, p: 1, mb: 1 }}
                />
                <FormControlLabel
                  value="Mastercard"
                  control={<Radio />}
                  label={
                    <Box display="flex" alignItems="center" gap={1}>
                      <CreditCardIcon sx={{ color: '#eb001b' }} />
                      <Typography>Mastercard</Typography>
                    </Box>
                  }
                  sx={{ border: 1, borderColor: selectedPaymentMethod === 'Mastercard' ? 'primary.main' : 'grey.300', borderRadius: 1, p: 1, mb: 1 }}
                />
              </RadioGroup>
            </FormControl>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              <CreditCardIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Enter Card Details
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ backgroundColor: '#f5f5f5', borderRadius: 2, p: 2, mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Paying with {selectedPaymentMethod} ending in ****
              </Typography>
              <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                Rs. {getTotalPrice()}
              </Typography>
            </Box>
            <TextField
              label="Card Number"
              value={paymentInfo.cardNumber}
              onChange={handleCardNumberChange}
              fullWidth
              margin="normal"
              placeholder="1234 5678 9012 3456"
              error={!!cardErrors.cardNumber}
              helperText={cardErrors.cardNumber}
              InputProps={{
                inputProps: { maxLength: 19 },
                startAdornment: <CreditCardIcon sx={{ mr: 1, color: 'grey.500' }} />
              }}
            />
            <TextField
              label="Cardholder Name"
              value={paymentInfo.cardHolder}
              onChange={(e) => {
                setPaymentInfo((prev) => ({ ...prev, cardHolder: e.target.value }));
                setCardErrors((prev) => ({ ...prev, cardHolder: '' }));
              }}
              fullWidth
              margin="normal"
              placeholder="JOHN DOE"
              error={!!cardErrors.cardHolder}
              helperText={cardErrors.cardHolder}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Expiry Date"
                  value={paymentInfo.expiryDate}
                  onChange={handleExpiryDateChange}
                  fullWidth
                  margin="normal"
                  placeholder="MM/YY"
                  error={!!cardErrors.expiryDate}
                  helperText={cardErrors.expiryDate}
                  InputProps={{ inputProps: { maxLength: 7 } }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="CVV"
                  value={paymentInfo.cvv}
                  onChange={handleCVVChange}
                  fullWidth
                  margin="normal"
                  placeholder="123"
                  type="password"
                  error={!!cardErrors.cvv}
                  helperText={cardErrors.cvv}
                  InputProps={{ inputProps: { maxLength: 4 } }}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 3:
        return (
          <Box display="flex" flexDirection="column" alignItems="center" py={4}>
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h6">Processing Payment...</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Please do not close this window
            </Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  const getStepButtonLabel = (step) => {
    switch (step) {
      case 0: return 'Proceed to Payment';
      case 1: return selectedPaymentMethod ? 'Continue' : 'Select a method';
      case 2: return `Pay Rs. ${getTotalPrice()}`;
      default: return 'Next';
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '120vh' }}>
      <Container maxWidth="md">
        {loading ? (
          <Box display="flex" justifyContent="center"><CircularProgress /></Box>
        ) : error && !activeStep && !orderSuccess ? (
          <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>
        ) : (
          <Paper elevation={3} style={{ padding: '20px', backgroundColor: 'white' }}>
            <Grid container spacing={3} justifyContent="center" alignItems="center">
              <Grid item xs={12} md={6}>
                <img src="/R.jfif" alt={item.name} style={{ width: '100%', height: 'auto', borderRadius: 8 }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h4" gutterBottom>{item.name}</Typography>
                <Typography variant="h6" gutterBottom>Item Code: {item.itemcode}</Typography>
                <Typography variant="h5" color="primary" gutterBottom fontWeight="bold">Rs. {item.price}</Typography>
                <Typography variant="body1" gutterBottom>Available Quantity: {item.quantity}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 2 }}>
                  <Typography variant="body1" sx={{ mr: 2 }}>Quantity:</Typography>
                  <TextField
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    inputProps={{ min: 1, max: item.quantity }}
                    style={{ width: '80px' }}
                    size="small"
                  />
                </Box>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Total: Rs. {getTotalPrice()}
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                  <Button variant="contained" color="success" size="large" onClick={handleBuyNow}>
                    Buy Now
                  </Button>
                  <Typography variant="body2" color="text.secondary">
                    100% Secure Payment
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mt={2}>
                  <Chip icon={<CreditCardIcon />} label="Visa" size="small" sx={{ mr: 1 }} />
                  <Chip icon={<CreditCardIcon />} label="Mastercard" size="small" />
                </Box>
              </Grid>
            </Grid>
          </Paper>
        )}
      </Container>

      {/* Payment Stepper Dialog */}
      <Dialog
        open={activeStep >= 0}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        disableEscapeKeyDown={processing}
      >
        <DialogTitle>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </DialogTitle>
        <DialogContent sx={{ minHeight: 250 }}>
          {renderStepContent(activeStep)}
        </DialogContent>
        {activeStep < 3 && (
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleClose} disabled={processing}>Cancel</Button>
            {activeStep > 0 && (
              <Button onClick={handleBack} disabled={processing}>Back</Button>
            )}
            {activeStep < 3 && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                disabled={(activeStep === 1 && !selectedPaymentMethod) || processing}
              >
                {getStepButtonLabel(activeStep)}
              </Button>
            )}
          </DialogActions>
        )}
      </Dialog>

      {/* Order Success Dialog */}
      <Dialog open={orderSuccess} onClose={() => { setOrderSuccess(false); handleClose(); }}>
        <DialogContent sx={{ textAlign: 'center', py: 4 }}>
          <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom fontWeight="bold">Payment Successful!</Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body1" gutterBottom>Your order has been placed successfully.</Typography>
          {orderId && <Typography variant="body2" color="text.secondary">Order ID: {orderId}</Typography>}
          <Typography variant="body2" color="text.secondary">
            Paid Rs. {getTotalPrice()} via {selectedPaymentMethod} (****{paymentInfo.cardNumber.slice(-4)})
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Status: <Chip label="Paid" color="success" size="small" />
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              setOrderSuccess(false);
              handleClose();
              navigate('/Order-History');
            }}
          >
            View Order History
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              setOrderSuccess(false);
              handleClose();
              navigate('/Itemlist');
            }}
          >
            Continue Shopping
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSuccessSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSuccessSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setOpenSuccessSnackbar(false)} severity="success" variant="filled" sx={{ width: '100%' }}>
          Payment successful! Order placed.
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ItemView;

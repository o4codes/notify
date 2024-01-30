#!/bin/bash

echo "Verify SQS Email"
awslocal ses verify-email-identity --email-address notify@mail.com
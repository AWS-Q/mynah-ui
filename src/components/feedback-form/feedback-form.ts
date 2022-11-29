/*!
 * Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { FeedbackPayload, FeedbackStars } from '../../static'
import { cancelEvent, DomBuilder, ExtendedHTMLElement } from '../../helper/dom'
import { Button } from '../button'
import { Overlay, OverlayHorizontalDirection, OverlayVerticalDirection } from '../overlay/overlay'
import { FeedbackFormComment } from './feedback-form-comment'
import { FeedbackFormStars } from './feedback-form-stars'

export interface FeedbackFormProps {
    onFeedbackSet: (feedbackPayload: FeedbackPayload) => void
    initPayload?: FeedbackPayload
}
export class FeedbackForm {
    private formOverlay!: Overlay
    private readonly feedbackStars: FeedbackFormStars
    private readonly feedbackComment: FeedbackFormComment
    private feedbackPayload: FeedbackPayload = {}
    private readonly triggerButton: ExtendedHTMLElement
    private readonly feedbackSubmitButton: Button
    public readonly feedbackFormContainer: ExtendedHTMLElement
    public readonly feedbackContainer: ExtendedHTMLElement
    private readonly onFeedbackSet

    constructor(props: FeedbackFormProps) {
        this.onFeedbackSet = props.onFeedbackSet
        if (props.initPayload !== undefined) {
            this.feedbackPayload = {
                ...(props.initPayload.stars !== undefined && { stars: props.initPayload.stars }),
                ...(props.initPayload.comment !== undefined && { comment: props.initPayload.comment }),
            }
        }

        this.triggerButton = DomBuilder.getInstance().build({
            type: 'a',
            classNames: ['mynah-feedback-trigger-button'],
            events: {
                click: () => {
                    this.formOverlay = new Overlay({
                        children: [this.feedbackFormContainer],
                        closeOnOutsideClick: true,
                        dimOutside: false,
                        horizontalDirection: OverlayHorizontalDirection.END_TO_LEFT,
                        verticalDirection: OverlayVerticalDirection.TO_BOTTOM,
                        referenceElement: this.triggerButton,
                    })
                },
            },
            innerHTML: 'Leave us feedback',
        })

        this.feedbackStars = new FeedbackFormStars({
            onChange: (star: FeedbackStars) => {
                this.feedbackPayload.stars = star
                this.onFeedbackSet({ stars: star })
                this.feedbackComment.setEnabled(true)
                this.feedbackSubmitButton.setEnabled(true)
            },
            initStar: this.feedbackPayload?.stars,
        })

        this.feedbackComment = new FeedbackFormComment({
            onChange: (comment: string) => {
                this.feedbackPayload.comment = comment
            },
            initComment: this.feedbackPayload?.comment,
        })

        this.feedbackSubmitButton = new Button({
            label: 'Submit',
            onClick: () => {
                if (this.feedbackPayload.comment !== undefined && this.feedbackPayload.comment.trim() !== '') {
                    this.onFeedbackSet({ comment: this.feedbackPayload.comment })
                }
                this.feedbackComment.setComment('')
                this.formOverlay.close()
            },
        })
        this.feedbackSubmitButton.setEnabled(false)

        this.feedbackFormContainer = DomBuilder.getInstance().build({
            type: 'div',
            classNames: ['mynah-feedback-form'],
            events: { click: cancelEvent },
            children: [this.feedbackStars.render, this.feedbackComment.render, this.feedbackSubmitButton.render],
        })

        this.feedbackContainer = DomBuilder.getInstance().build({
            type: 'div',
            attributes: { id: 'mynah-feedback-form-container' },
            children: [this.triggerButton],
        })
    }
}
